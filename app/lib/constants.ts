export const SESSION_COOKIE_NAME = "session";

// Routes reachable without a session. /health in particular must stay public:
// it's most useful exactly when the backend is down and login can't work.
export const PUBLIC_PATHS = ["/login", "/health"];

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

// Recordings shorter than this can't be meaningfully scored, so the record
// pages keep the stop button disabled until it's reached. /api/analyze
// separately rejects recordings with too little audible speech.
export const MIN_PITCH_SECONDS = 5;
