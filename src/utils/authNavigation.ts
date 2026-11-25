export type AuthMode = "signin" | "signup";

let returnScroll = 0;

// Hash routing keeps the standalone auth page reachable on static hosting.
export function getAuthMode(): AuthMode | null {
  if (typeof window === "undefined") return null;
  if (window.location.hash === "#/auth") return "signin";
  if (window.location.hash === "#/auth/create-account") return "signup";
  return null;
}

export function navigateToAuth(mode: AuthMode = "signin") {
  returnScroll = window.scrollY;
  const hash = mode === "signup" ? "#/auth/create-account" : "#/auth";
  if (window.location.hash === hash) {
    window.dispatchEvent(new Event("cosmox:route"));
  } else {
    window.location.hash = hash;
  }
  window.scrollTo(0, 0);
}

export function navigateHome() {
  window.history.pushState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new Event("cosmox:route"));
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() => window.scrollTo({ top: returnScroll, behavior: "auto" })),
  );
}