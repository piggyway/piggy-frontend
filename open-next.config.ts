import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config. Enable R2 incremental cache later if needed:
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
// export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache });

export default defineCloudflareConfig({});
