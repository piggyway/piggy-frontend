import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

/**
 * Without an incremental cache the Worker has nowhere to store Next's fetch
 * cache, so every `next: { revalidate }` in the app is silently ignored and
 * each render re-fetches the backend. R2 (binding `NEXT_INC_CACHE_R2_BUCKET`)
 * gives those entries a home, which is what keeps catalog reads off the
 * backend rate limiter.
 *
 * The cache alone only stores entries, it never refreshes them: the default
 * queue is a dummy that throws, so every stale ISR page (`revalidate = 3600`
 * on the home page, shop and sitemap) logs `Failed to revalidate stale page`
 * and stays stale forever. `memoryQueue` re-requests the route through the
 * `WORKER_SELF_REFERENCE` service binding, de-duped per isolate.
 *
 * `withRegionalCache` is deliberately not used: it only pays off together with
 * cache purge, and on Next 16 its tag-cache bypass is off by default anyway.
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: memoryQueue,
});
