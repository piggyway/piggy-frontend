// Auto-merge gate for piggyway pull requests.
// `risk` sorts the changed files into Low, Medium or High with .github/risk-tiers.json,
// and reads the local review record from the PR body.
// `gate` decides merge, blocked or escalate from the CI results, the risk outputs and the review record.
// All decisions are code. A missing or malformed review record blocks the merge.
// Usage: node .github/scripts/auto-merge.mjs <risk|gate> [--dry-run]

import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const MARKER = "<!-- auto-merge-gate -->";
const TIERS = ["Low", "Medium", "High"];
const HOLD_LABEL = "hold";
const BLOCKED_LABEL = "auto-merge:blocked";
const HIGH_LABEL = "risk:high";
const LABEL_SPECS = {
  [HIGH_LABEL]: {
    color: "d73a4a",
    description: "Auto-merge gate sent this PR to the owner",
  },
  [BLOCKED_LABEL]: {
    color: "fbca04",
    description: "Auto-merge gate blocked this PR",
  },
};
const RECORD_PATTERN =
  /<!-- local-review: sha=([0-9a-f]{40}) important=(\d+) security=(\d+) nit=(\d+) rounds=(\d+) -->/g;
const RECORD_PREFIX = "<!-- local-review:";
const RECORD_FIELDS = ["important", "security", "nit", "rounds"];
const CONFIG_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "risk-tiers.json"
);

function fail(message) {
  throw new Error(message);
}

function isStringArray(value) {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.length > 0)
  );
}

function isPositiveInt(value) {
  return Number.isInteger(value) && value > 0;
}

function isCount(value) {
  return Number.isInteger(value) && value >= 0;
}

function shortSha(sha) {
  return typeof sha === "string" ? sha.slice(0, 7) : String(sha);
}

export function validateConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config))
    fail("risk-tiers.json must hold a JSON object");
  if (
    !isStringArray(config.trusted_authors) ||
    config.trusted_authors.length === 0
  ) {
    fail(
      "risk-tiers.json: trusted_authors must be a non-empty array of strings"
    );
  }
  if (typeof config.notify !== "string" || config.notify === "")
    fail("risk-tiers.json: notify must be a login");
  if (!isPositiveInt(config.max_changed_lines))
    fail("risk-tiers.json: max_changed_lines must be a positive integer");
  if (!isPositiveInt(config.circuit_breaker_days)) {
    fail("risk-tiers.json: circuit_breaker_days must be a positive integer");
  }
  if (!isStringArray(config.skip))
    fail("risk-tiers.json: skip must be an array of globs");
  if (!isStringArray(config.low))
    fail("risk-tiers.json: low must be an array of globs");
  if (
    !config.high ||
    typeof config.high !== "object" ||
    Array.isArray(config.high)
  ) {
    fail("risk-tiers.json: high must be an object of named glob groups");
  }
  if (Object.keys(config.high).length === 0)
    fail("risk-tiers.json: high must have at least one group");
  for (const [group, globs] of Object.entries(config.high)) {
    if (!isStringArray(globs) || globs.length === 0)
      fail(`risk-tiers.json: high group "${group}" has no globs`);
  }
  return config;
}

export function loadConfig(file = CONFIG_PATH) {
  return validateConfig(JSON.parse(readFileSync(file, "utf8")));
}

function matchesAny(filePath, globs) {
  return globs.some((glob) => path.posix.matchesGlob(filePath, glob));
}

export function classify(files, config) {
  if (!Array.isArray(files)) fail("classify expects an array of PR files");
  const highPaths = new Set();
  const skipped = [];
  let rank = 0;
  let changedLines = 0;
  for (const file of files) {
    if (typeof file?.filename !== "string" || file.filename === "")
      fail("A PR file entry has no filename");
    const names = [file.filename];
    if (
      typeof file.previous_filename === "string" &&
      file.previous_filename !== ""
    ) {
      names.push(file.previous_filename);
    }
    if (names.every((name) => matchesAny(name, config.skip))) {
      skipped.push(file.filename);
      continue;
    }
    if (!isCount(file.additions) || !isCount(file.deletions)) {
      fail(
        `PR file ${file.filename} has no valid additions or deletions count`
      );
    }
    changedLines += file.additions + file.deletions;
    let fileRank = 1;
    for (const [group, globs] of Object.entries(config.high)) {
      for (const name of names) {
        if (matchesAny(name, globs)) {
          highPaths.add(`${group}: ${name}`);
          fileRank = 2;
        }
      }
    }
    if (fileRank === 1 && names.every((name) => matchesAny(name, config.low)))
      fileRank = 0;
    rank = Math.max(rank, fileRank);
  }
  return {
    tier: TIERS[rank],
    changedLines,
    highPaths: [...highPaths],
    skipped,
  };
}

export function parseReviewRecord(body) {
  if (typeof body !== "string") return null;
  const prefixCount = body.split(RECORD_PREFIX).length - 1;
  const matches = [...body.matchAll(RECORD_PATTERN)];
  if (prefixCount !== 1 || matches.length !== 1) return null;
  const [, sha, ...counts] = matches[0];
  const record = { sha };
  RECORD_FIELDS.forEach((field, index) => {
    record[field] = Number(counts[index]);
  });
  return record;
}

function isValidRecord(record) {
  return (
    record !== null &&
    typeof record === "object" &&
    typeof record.sha === "string" &&
    /^[0-9a-f]{40}$/.test(record.sha) &&
    RECORD_FIELDS.every((field) => isCount(record[field]))
  );
}

export function decide(input) {
  const { config, ciJobs, needs, risk, pr, reverts, record } = input;
  if (!Array.isArray(ciJobs) || ciJobs.length === 0)
    fail("decide needs at least one CI job");
  if (!Array.isArray(reverts)) fail("decide needs the list of revert commits");

  const red = ciJobs
    .map((job) => [job, needs?.[job]?.result ?? "missing"])
    .filter(([, result]) => result !== "success");
  if (red.length > 0) {
    return {
      action: "blocked",
      reasons: red.map(([job, result]) => `CI is not green: ${job}=${result}`),
    };
  }

  const held = [];
  if (pr.draft) held.push("PR is a draft");
  if (pr.labels.includes(HOLD_LABEL))
    held.push(`PR has the "${HOLD_LABEL}" label`);
  if (held.length > 0) return { action: "blocked", reasons: held };

  const riskResult = needs?.risk?.result ?? "missing";
  const escalate = [];
  if (riskResult !== "success" || !risk) {
    escalate.push(`Risk job did not succeed: risk=${riskResult}`);
  } else {
    const trusted = config.trusted_authors.map((login) => login.toLowerCase());
    if (!trusted.includes(risk.author.toLowerCase()))
      escalate.push(`Author ${risk.author} is not a trusted author`);
    if (risk.tier === "High")
      escalate.push(`Risk tier is High: ${risk.highPaths.join("; ")}`);
    if (risk.changedLines > config.max_changed_lines) {
      escalate.push(
        `PR changes ${risk.changedLines} lines; the limit is ${config.max_changed_lines}`
      );
    }
  }
  if (reverts.length > 0) {
    escalate.push(
      `Circuit breaker: a revert landed on production in the last ${config.circuit_breaker_days} days: ${reverts.join("; ")}`
    );
  }
  if (escalate.length > 0) return { action: "escalate", reasons: escalate };

  if (pr.headSha !== risk.headSha) {
    return {
      action: "blocked",
      reasons: [
        `PR head moved from ${shortSha(risk.headSha)} to ${shortSha(pr.headSha)} after the risk job; a newer run decides`,
      ],
    };
  }

  if (!isValidRecord(record))
    return {
      action: "blocked",
      reasons: ["No local review record in the PR body"],
    };

  if (record.sha !== risk.headSha) {
    return {
      action: "blocked",
      reasons: [
        `Local review covers ${shortSha(record.sha)}, head is ${shortSha(risk.headSha)}; review again`,
      ],
    };
  }

  const open = [];
  if (record.important > 0)
    open.push(`Local review reports ${record.important} Important findings`);
  if (record.security > 0)
    open.push(`Local review reports ${record.security} security findings`);
  if (open.length > 0) return { action: "blocked", reasons: open };

  return {
    action: "merge",
    reasons: [
      `Tier ${risk.tier}, CI green, local review of ${shortSha(record.sha)} reports 0 Important and 0 security findings`,
    ],
  };
}

function gh(args, input) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    input,
    stdio: ["pipe", "pipe", "inherit"],
    maxBuffer: 64 * 1024 * 1024,
  });
}

function ghJson(args) {
  const out = gh(args);
  try {
    return JSON.parse(out);
  } catch (error) {
    throw new Error(
      `gh ${args.join(" ")} returned invalid JSON: ${error.message}`
    );
  }
}

function ghSend(method, endpoint, body) {
  return gh(
    ["api", "-X", method, endpoint, "--input", "-"],
    JSON.stringify(body)
  );
}

function ghPages(endpoint, what) {
  const pages = ghJson(["api", "--paginate", "--slurp", endpoint]);
  if (!Array.isArray(pages) || !pages.every(Array.isArray))
    fail(`GitHub returned an unexpected shape for ${what}`);
  return pages.flat();
}

function env(name) {
  const value = process.env[name];
  if (value === undefined || value === "") fail(`Missing env ${name}`);
  return value;
}

function jsonEnv(name) {
  const raw = env(name);
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Env ${name} is not valid JSON: ${error.message}`);
  }
}

function prContext() {
  const repo = env("REPO");
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo))
    fail(`REPO must look like owner/name, got "${repo}"`);
  const prNumber = env("PR_NUMBER");
  if (!/^[1-9]\d*$/.test(prNumber))
    fail(`PR_NUMBER must be a positive integer, got "${prNumber}"`);
  return { repo, prNumber };
}

function fetchPr(repo, prNumber) {
  const pr = ghJson(["api", `repos/${repo}/pulls/${prNumber}`]);
  if (typeof pr?.user?.login !== "string")
    fail(`PR #${prNumber} has no author login`);
  if (typeof pr.draft !== "boolean") fail(`PR #${prNumber} has no draft flag`);
  if (!Array.isArray(pr.labels)) fail(`PR #${prNumber} has no label list`);
  if (typeof pr.head?.sha !== "string") fail(`PR #${prNumber} has no head sha`);
  if (!isCount(pr.changed_files))
    fail(`PR #${prNumber} has no changed_files count`);
  return {
    author: pr.user.login,
    draft: pr.draft,
    labels: pr.labels.map((label) => label.name),
    headSha: pr.head.sha,
    changedFiles: pr.changed_files,
    body: typeof pr.body === "string" ? pr.body : "",
  };
}

function findReverts(repo, days, now) {
  const since = new Date(now - days * 86_400_000).toISOString();
  const commits = ghPages(
    `repos/${repo}/commits?sha=production&since=${since}&per_page=100`,
    "production commits"
  );
  return commits
    .map((commit) => {
      if (typeof commit?.commit?.message !== "string")
        fail("A production commit has no message");
      return { sha: commit.sha, title: commit.commit.message.split("\n")[0] };
    })
    .filter(({ title }) => /^Revert\b/i.test(title))
    .map(({ sha, title }) => `${shortSha(sha)} ${title}`);
}

function writeOutputs(outputs) {
  const file = env("GITHUB_OUTPUT");
  const lines = Object.entries(outputs).map(([key, value]) => {
    if (/[\r\n]/.test(value)) fail(`Output ${key} has a line break`);
    return `${key}=${value}\n`;
  });
  appendFileSync(file, lines.join(""));
}

function writeSummary(markdown) {
  appendFileSync(env("GITHUB_STEP_SUMMARY"), `${markdown}\n`);
}

function runRisk(dryRun) {
  const { repo, prNumber } = prContext();
  const config = loadConfig();
  const pr = fetchPr(repo, prNumber);
  const files = ghPages(
    `repos/${repo}/pulls/${prNumber}/files?per_page=100`,
    "PR files"
  );
  if (files.length !== pr.changedFiles) {
    fail(
      `GitHub listed ${files.length} files but the PR has ${pr.changedFiles}; the files API stops at 3000 files`
    );
  }
  const result = classify(files, config);
  const record = parseReviewRecord(pr.body);
  const outputs = {
    tier: result.tier,
    changed_lines: String(result.changedLines),
    high_paths: JSON.stringify(result.highPaths),
    author: pr.author,
    head_sha: pr.headSha,
    draft: String(pr.draft),
    labels: JSON.stringify(pr.labels),
    review_record: record ? JSON.stringify(record) : "",
  };
  const summary = [
    `### Risk tier: ${result.tier}`,
    "",
    `- Changed lines outside skip paths: ${result.changedLines}`,
    `- Author: ${pr.author}`,
    `- Head: ${pr.headSha}`,
    `- Skipped files: ${result.skipped.length}`,
    `- Local review record: ${record ? `sha ${shortSha(record.sha)}, important ${record.important}, security ${record.security}, nit ${record.nit}, rounds ${record.rounds}` : "missing or malformed"}`,
    `- High paths: ${result.highPaths.length > 0 ? "" : "none"}`,
    ...result.highPaths.map((entry) => `  - ${entry}`),
  ].join("\n");
  if (dryRun) {
    console.log(JSON.stringify({ outputs, skipped: result.skipped }, null, 2));
    return;
  }
  writeOutputs(outputs);
  writeSummary(summary);
}

function readRiskEnv() {
  const tier = env("TIER");
  if (!TIERS.includes(tier))
    fail(`TIER must be one of ${TIERS.join(", ")}, got "${tier}"`);
  const changedLines = env("CHANGED_LINES");
  if (!/^\d+$/.test(changedLines))
    fail(`CHANGED_LINES must be an integer, got "${changedLines}"`);
  const highPaths = jsonEnv("HIGH_PATHS");
  if (!isStringArray(highPaths))
    fail("HIGH_PATHS must be a JSON array of strings");
  const headSha = env("HEAD_SHA");
  if (!/^[0-9a-f]{40}$/.test(headSha))
    fail(`HEAD_SHA must be a 40-character sha, got "${headSha}"`);
  const draft = env("DRAFT");
  if (draft !== "true" && draft !== "false")
    fail(`DRAFT must be true or false, got "${draft}"`);
  const labels = jsonEnv("LABELS");
  if (!isStringArray(labels)) fail("LABELS must be a JSON array of strings");
  return {
    tier,
    changedLines: Number(changedLines),
    highPaths,
    author: env("AUTHOR"),
    headSha,
    draft: draft === "true",
    labels,
  };
}

function readRecordEnv() {
  const raw = process.env.REVIEW_RECORD ?? "";
  if (raw === "") return null;
  let record;
  try {
    record = JSON.parse(raw);
  } catch (error) {
    throw new Error(`REVIEW_RECORD is not valid JSON: ${error.message}`);
  }
  if (!isValidRecord(record))
    fail(`REVIEW_RECORD has an unexpected shape: ${raw}`);
  return record;
}

function renderReport({ decision, risk, config, record, mention }) {
  const lines = [];
  if (mention) lines.push(`@${config.notify} this PR needs your review.`, "");
  lines.push(
    MARKER,
    `### Auto-merge gate: ${decision.action}`,
    "",
    `- Tier: ${risk?.tier ?? "unknown"}`,
    `- Changed lines outside skip paths: ${risk?.changedLines ?? "unknown"}`,
    `- Head: ${risk?.headSha ?? "unknown"}`,
    `- Local review record: ${record ? `sha ${shortSha(record.sha)}, important ${record.important}, security ${record.security}` : "missing"}`,
    "",
    "Reasons:",
    "",
    ...decision.reasons.map((reason) => `- ${reason}`)
  );
  return lines.join("\n");
}

function addLabel(repo, prNumber, labels, name) {
  if (labels.includes(name)) return;
  const spec = LABEL_SPECS[name];
  gh([
    "label",
    "create",
    name,
    "--repo",
    repo,
    "--color",
    spec.color,
    "--description",
    spec.description,
    "--force",
  ]);
  ghSend("POST", `repos/${repo}/issues/${prNumber}/labels`, { labels: [name] });
}

function removeLabel(repo, prNumber, labels, name) {
  if (!labels.includes(name)) return;
  gh([
    "api",
    "-X",
    "DELETE",
    `repos/${repo}/issues/${prNumber}/labels/${encodeURIComponent(name)}`,
  ]);
}

function upsertComment(repo, prNumber, body) {
  const comments = ghPages(
    `repos/${repo}/issues/${prNumber}/comments?per_page=100`,
    "PR comments"
  );
  const sticky = comments.find(
    (comment) => comment?.user?.type === "Bot" && comment.body?.includes(MARKER)
  );
  if (sticky) {
    ghSend("PATCH", `repos/${repo}/issues/comments/${sticky.id}`, { body });
  } else {
    ghSend("POST", `repos/${repo}/issues/${prNumber}/comments`, { body });
  }
}

function applyDecision({
  repo,
  prNumber,
  config,
  decision,
  risk,
  labels,
  record,
}) {
  if (decision.action === "merge") {
    gh([
      "pr",
      "merge",
      prNumber,
      "--repo",
      repo,
      "--merge",
      "--match-head-commit",
      risk.headSha,
    ]);
    removeLabel(repo, prNumber, labels, BLOCKED_LABEL);
    removeLabel(repo, prNumber, labels, HIGH_LABEL);
  } else if (decision.action === "blocked") {
    addLabel(repo, prNumber, labels, BLOCKED_LABEL);
    removeLabel(repo, prNumber, labels, HIGH_LABEL);
  } else if (decision.action === "escalate") {
    addLabel(repo, prNumber, labels, HIGH_LABEL);
    removeLabel(repo, prNumber, labels, BLOCKED_LABEL);
    ghSend("POST", `repos/${repo}/issues/${prNumber}/assignees`, {
      assignees: [config.notify],
    });
    if (!labels.includes(HIGH_LABEL)) {
      ghSend("POST", `repos/${repo}/issues/${prNumber}/comments`, {
        body: `@${config.notify} the auto-merge gate will not merge this PR. Reasons:\n\n${decision.reasons.map((reason) => `- ${reason}`).join("\n")}`,
      });
    }
  } else {
    fail(`Unknown action "${decision.action}"`);
  }
  upsertComment(
    repo,
    prNumber,
    renderReport({ decision, risk, config, record, mention: false })
  );
}

function runGate(dryRun) {
  const { repo, prNumber } = prContext();
  const config = loadConfig();
  const needs = jsonEnv("NEEDS");
  if (!needs || typeof needs !== "object" || Array.isArray(needs))
    fail("NEEDS must be a JSON object");
  const ciJobs = env("CI_JOBS")
    .split(",")
    .map((job) => job.trim())
    .filter(Boolean);
  if (ciJobs.length === 0) fail("CI_JOBS must name at least one job");
  const risk = needs.risk?.result === "success" ? readRiskEnv() : null;
  const record = readRecordEnv();
  const live = fetchPr(repo, prNumber);
  const pr = {
    draft: live.draft || (risk?.draft ?? false),
    labels: [...new Set([...live.labels, ...(risk?.labels ?? [])])],
    headSha: live.headSha,
  };
  const reverts = findReverts(repo, config.circuit_breaker_days, Date.now());
  const decision = decide({ config, ciJobs, needs, risk, pr, reverts, record });
  if (dryRun) {
    console.log(JSON.stringify(decision, null, 2));
    return;
  }
  applyDecision({
    repo,
    prNumber,
    config,
    decision,
    risk,
    labels: live.labels,
    record,
  });
  writeSummary(
    renderReport({ decision, risk, config, record, mention: false })
  );
}

function main(argv) {
  const [command, ...flags] = argv;
  const unknown = flags.filter((flag) => flag !== "--dry-run");
  if (unknown.length > 0) fail(`Unknown arguments: ${unknown.join(" ")}`);
  const dryRun = flags.includes("--dry-run");
  if (command === "risk") return runRisk(dryRun);
  if (command === "gate") return runGate(dryRun);
  fail(`Unknown command "${command ?? ""}". Use risk or gate`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  main(process.argv.slice(2));
}
