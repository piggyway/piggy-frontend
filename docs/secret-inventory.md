# Secret inventory and deployment policy

This document records secret **names**, consumers, and handling requirements.
It must never contain secret values, token fragments, screenshots, or copies of
provider credentials.

## Storage policy

- Local development values belong in an ignored `.env.local` file.
- Staging and production values belong in AWS Secrets Manager when the AWS
  infrastructure is provisioned.
- Git, Linear, pull requests, GitHub Actions logs, and example configuration
  files must contain names or empty placeholders only.
- Variables beginning with `NEXT_PUBLIC_` are browser-visible configuration,
  not secrets. Do not place private values in them.

## Runtime secrets

| Secret name            | Consumer                                                            | AWS secret location                      |
| ---------------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| `STRIPE_SECRET_KEY`    | Checkout-success server page when retrieving Stripe payment details | Piggyway staging frontend runtime secret |
| `NEXTAUTH_SECRET`      | NextAuth route and refresh-token route                              | Piggyway staging frontend runtime secret |
| `GOOGLE_CLIENT_SECRET` | Google OAuth provider in the NextAuth route                         | Piggyway staging frontend runtime secret |
| `PREVIEW_SECRET`       | Draft-preview route and server-side product-preview requests        | Piggyway staging frontend runtime secret |

`GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` are public identifiers. They may be deployed
as configuration, but are not a substitute for the private secrets above.

The secret-scan workflow uses GitHub's automatically issued, short-lived
`GITHUB_TOKEN`; no value is stored in this repository. If this repository is
owned by a GitHub organization, its administrator must provide the scanner's
required `GITLEAKS_LICENSE` as an encrypted GitHub Actions secret. That license
is CI tooling configuration, not an application runtime secret.

## PIG-9 audit and rotation record

Audit date: 2026-07-31.

- A non-empty `PREVIEW_SECRET` was found in tracked `.env.example` and its Git
  history. It is treated as exposed or uncertain.
- The tracked value was removed on this branch. The secret owner must generate
  a new high-entropy preview secret, update every preview sender and runtime
  that uses it, and invalidate the previous value before staging deployment.
- The audit found no committed private-key or certificate files, no current
  common AWS/Stripe/GitHub credential formats, and no long-lived AWS
  credentials in the existing GitHub Actions workflow.
- This repository scan cannot prove that values held by external providers are
  inactive. The provider owner must record rotation completion in the ticket
  without recording any secret value.

## CI/CD AWS credential policy

The current workflow is a quality gate only and does not deploy to AWS. When a
deployment workflow is added, it must:

1. Use GitHub OIDC with `id-token: write` and an AWS IAM role scoped to the
   staging repository, branch, and environment.
2. Use temporary credentials through `aws-actions/configure-aws-credentials`.
3. Never use `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, access-key files,
   or other long-lived cloud credentials in GitHub secrets or workflow YAML.
4. Read runtime secret values only from AWS Secrets Manager at deployment or
   runtime, as defined by the infrastructure task.
