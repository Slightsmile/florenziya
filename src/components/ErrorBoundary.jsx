import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Florenziya render error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-cream">
          <h1 className="font-serif text-3xl font-semibold mb-3">Something went wrong</h1>
          <p className="text-ink/60 mb-8 max-w-md">
            We ran into an unexpected problem. Please try reloading the page — your cart is saved.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-ink text-cream font-semibold px-6 py-3 rounded-full hover:bg-gold hover:text-ink transition-colors"
            >
              Reload
            </button>
            <Link
              to="/"
              className="border border-ink/20 font-semibold px-6 py-3 rounded-full hover:border-gold transition-colors"
            >
              Go Home
            </Link>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
