export const SESSION_COOKIE_NAME = "session";

// Routes reachable without a session. /health in particular must stay public:
// it's most useful exactly when the backend is down and login can't work.
export const PUBLIC_PATHS = ["/login", "/health"];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}
