"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/monitoring/report";

/**
 * Last-resort boundary. It replaces the root layout, so `globals.css`, the
 * font variable and every shared component are gone by the time it renders -
 * the markup below is deliberately self-contained and inline-styled.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      scope: "app.global-error",
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fffbf5",
          color: "#050451",
          fontFamily:
            "Outfit, ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <main
          style={{
            maxWidth: "34rem",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
            Something went wrong
          </h1>
          <p
            style={{
              margin: "1rem 0 2rem",
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            The page failed to load. Nothing you were doing has been lost -
            please try again, or head back to the home page.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                cursor: "pointer",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: "#050451",
                color: "#ffffff",
                padding: "0.75rem 1.75rem",
                fontSize: "1rem",
              }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              style={{
                cursor: "pointer",
                borderRadius: "9999px",
                border: "1px solid #050451",
                backgroundColor: "transparent",
                color: "#050451",
                padding: "0.75rem 1.75rem",
                fontSize: "1rem",
              }}
            >
              Back to home
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
