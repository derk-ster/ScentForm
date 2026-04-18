"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Shown when a child throws during render (not for async/event errors). */
  fallback: ReactNode;
};

type State = { hasError: boolean };

/**
 * Class error boundary — React only supports this pattern for catching
 * render errors in the subtree.
 */
export class ReactErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ReactErrorBoundary]", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
