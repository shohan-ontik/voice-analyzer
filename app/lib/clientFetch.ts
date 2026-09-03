// Wraps fetch() for calls to our own authenticated /api/* routes. Those
// routes clear the session cookie server-side (see apiErrorResponse in
// apiClient.ts) whenever the backend rejects the token, so a 401 here means
// the session is genuinely gone — send the user to login instead of letting
// callers render it as an inline "Not authenticated." error.
export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    // A full navigation (not router.push) so proxy.ts re-runs against the
    // now-cleared cookie and any stale client state (useAppState, etc.) is
    // dropped rather than carried into the login page.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }
  return res;
}
