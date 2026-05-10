import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error("UI crash captured:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-xl w-full border border-error/40 bg-error/10 p-8">
            <h1 className="text-2xl font-semibold text-error">
              Interface Failure Detected
            </h1>
            <p className="mt-3 text-sm text-muted">
              A recoverable UI error occurred. Refresh the page or
              return to the login screen.
            </p>
            <button
              className="mt-6 border border-error/50 px-4 py-2 text-sm uppercase tracking-widest text-error hover:bg-error/10 transition-colors"
              onClick={() => window.location.assign("/login")}
            >
              Return To Access Panel
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
