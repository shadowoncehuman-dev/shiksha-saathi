/**
 * Lightweight client-side runtime error logger.
 * Captures window errors, unhandled promise rejections and Vite preload
 * (dynamic import) failures with stack traces + failed asset URLs.
 * Entries are kept in a sessionStorage ring buffer so they survive the
 * automatic reload we perform for stale chunks, and are printed as a
 * structured group in the console.
 */

export type RuntimeErrorEntry = {
  ts: string;                // ISO timestamp (UTC)
  type: "error" | "unhandledrejection" | "chunk-load" | "vite:preloadError" | "boundary";
  message: string;
  stack?: string;
  assetUrl?: string;         // failed chunk / asset URL if detectable
  route: string;
  buildId: string;
  userAgent: string;
};

const STORAGE_KEY = "bbdbass_runtime_errors";
const MAX_ENTRIES = 30;

export const BUILD_ID: string = (import.meta.env.VITE_BUILD_ID as string) || "dev";

const ASSET_URL_RE = /https?:\/\/[^\s'"]+\.(?:m?js|css)(?:\?[^\s'"]*)?/i;

export const extractAssetUrl = (input: unknown): string | undefined => {
  const text =
    typeof input === "string"
      ? input
      : input instanceof Error
      ? `${input.message}\n${input.stack || ""}`
      : "";
  return text.match(ASSET_URL_RE)?.[0];
};

export const isChunkLoadError = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk|Loading CSS chunk|error loading dynamically imported module/i.test(msg);
};

const readBuffer = (): RuntimeErrorEntry[] => {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
};

const writeBuffer = (entries: RuntimeErrorEntry[]) => {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES))); } catch { /* quota */ }
};

export const getRuntimeErrors = (): RuntimeErrorEntry[] => readBuffer();
export const clearRuntimeErrors = () => { try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ } };

export const logRuntimeError = (
  type: RuntimeErrorEntry["type"],
  err: unknown,
  extra: Partial<RuntimeErrorEntry> = {},
) => {
  const error = err instanceof Error ? err : new Error(String(err ?? "Unknown error"));
  const entry: RuntimeErrorEntry = {
    ts: new Date().toISOString(),
    type,
    message: error.message,
    stack: error.stack,
    assetUrl: extra.assetUrl ?? extractAssetUrl(error),
    route: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
    buildId: BUILD_ID,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    ...extra,
  };
  writeBuffer([...readBuffer(), entry]);

  // Structured console output (visible in Lovable console + browser devtools)
  console.groupCollapsed(`%c[RuntimeError:${type}] ${entry.message}`, "color:#e11d48;font-weight:bold");
  console.error("route:", entry.route, "| build:", entry.buildId, "| at:", entry.ts);
  if (entry.assetUrl) console.error("failed asset:", entry.assetUrl);
  if (entry.stack) console.error(entry.stack);
  console.groupEnd();
  return entry;
};

let installed = false;
export const installGlobalErrorLogging = () => {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (e) => {
    // Resource load failures (script/link/img) bubble here with a target but no error object
    const target = e.target as HTMLElement | null;
    if (target && target !== (window as unknown as HTMLElement) && (target as HTMLScriptElement).src) {
      const src = (target as HTMLScriptElement).src || (target as HTMLLinkElement).href;
      logRuntimeError("chunk-load", new Error(`Asset failed to load: ${src}`), { assetUrl: src });
      return;
    }
    logRuntimeError("error", e.error ?? e.message);
  }, true);

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    logRuntimeError(isChunkLoadError(reason) ? "chunk-load" : "unhandledrejection", reason);
  });

  // Vite emits this when a modulepreload'ed chunk fails (typically after a redeploy)
  window.addEventListener("vite:preloadError", (e) => {
    const payload = (e as unknown as { payload?: Error }).payload;
    logRuntimeError("vite:preloadError", payload ?? new Error("vite:preloadError"));
  });
};

/**
 * Compare the running build against the server's version.json.
 * Returns true when a newer deployment exists (so cached chunks are stale).
 */
export const isNewBuildAvailable = async (): Promise<boolean> => {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return false;
    const { buildId } = (await res.json()) as { buildId?: string };
    return !!buildId && buildId !== BUILD_ID && BUILD_ID !== "dev";
  } catch {
    return false;
  }
};
