import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, Home, WifiOff, AlertTriangle } from "lucide-react";
import { isChunkLoadError, logRuntimeError, isNewBuildAvailable } from "@/lib/error-logger";

interface Props {
  children: ReactNode;
  /** Changes to this key reset the boundary (e.g. route pathname) */
  resetKey?: string;
}

interface State {
  error: Error | null;
  retrying: boolean;
}

/**
 * Catches render / lazy-import failures for a route and shows a friendly
 * retry card instead of a blank screen.
 */
class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null, retrying: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logRuntimeError(isChunkLoadError(error) ? "chunk-load" : "boundary", error, {
      stack: `${error.stack || ""}\n\nComponent stack:${info.componentStack || ""}`,
    });
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null, retrying: false });
    }
  }

  handleRetry = async () => {
    this.setState({ retrying: true });
    const chunk = isChunkLoadError(this.state.error);
    // For stale chunks, a fresh navigation is the only reliable fix
    if (chunk || (await isNewBuildAvailable())) {
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(Date.now()));
      window.location.replace(url.toString());
      return;
    }
    this.setState({ error: null, retrying: false });
  };

  render() {
    const { error, retrying } = this.state;
    if (!error) return this.props.children;

    const chunk = isChunkLoadError(error);
    const offline = typeof navigator !== "undefined" && !navigator.onLine;

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="glass-strong rounded-[2rem] p-8 md:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            {offline ? <WifiOff className="text-destructive" size={30} /> : <AlertTriangle className="text-destructive" size={30} />}
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
            {offline ? "You appear to be offline" : chunk ? "Page failed to load" : "Something went wrong"}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            {offline
              ? "Check your internet connection and try again."
              : chunk
              ? "A new version of the portal was published while you were browsing. Reload to get the latest files."
              : "An unexpected error occurred while rendering this page. You can retry or return home."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleRetry}
              disabled={retrying}
              className="btn-primary flex-1 h-12 rounded-xl inline-flex items-center justify-center gap-2 font-semibold disabled:opacity-60"
            >
              <RefreshCw size={16} className={retrying ? "animate-spin" : ""} />
              {chunk ? "Reload page" : "Try again"}
            </button>
            <a
              href="/"
              className="flex-1 h-12 rounded-xl inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              <Home size={16} /> Home
            </a>
          </div>
          {import.meta.env.DEV && (
            <pre className="mt-6 text-left text-[11px] text-destructive/80 bg-destructive/5 rounded-xl p-3 overflow-auto max-h-40">
              {error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default RouteErrorBoundary;
