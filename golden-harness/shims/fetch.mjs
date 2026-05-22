/**
 * Fetch interceptor: Captures request bodies and returns empty 200 OK.
 * Used to capture the request body that ST assembles for API calls.
 */

let captured = [];

function interceptedFetch(url, init = {}) {
  const entry = {
    url: typeof url === 'string' ? url : url.toString(),
    method: init.method || 'GET',
    headers: init.headers ? Object.fromEntries(
      init.headers instanceof Headers
        ? init.headers.entries()
        : Array.isArray(init.headers)
          ? init.headers
          : Object.entries(init.headers || {})
    ) : {},
    body: init.body || null,
    timestamp: Date.now(),
  };

  // Try to parse JSON body for easier diffing
  if (typeof entry.body === 'string') {
    try {
      entry.bodyJson = JSON.parse(entry.body);
    } catch {
      // Not JSON — leave as string
    }
  }

  captured.push(entry);

  // Return a 200 OK response with empty body
  return Promise.resolve(new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
  }));
}

function getCaptured() {
  return [...captured];
}

function clearCaptured() {
  captured = [];
}

// Install as global
globalThis.fetch = interceptedFetch;

export { interceptedFetch as fetch, getCaptured, clearCaptured };
