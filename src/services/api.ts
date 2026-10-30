const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const MAX_RETRIES = 3;
const CACHE_TTL_MS = 10 * 60 * 1000;

// Responses (and in-flight requests) are shared by endpoint, so pages that ask for the
// same data in parallel or on revisit hit the network once per TTL
const cache = new Map<string, { expires: number; promise: Promise<unknown> }>();

export function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const cached = cache.get(endpoint);
  if (cached && cached.expires > Date.now()) return cached.promise as Promise<T>;

  const promise = request<T>(endpoint);
  cache.set(endpoint, { expires: Date.now() + CACHE_TTL_MS, promise });
  // Failed requests are not cached, so a retry goes back to the network
  promise.catch(() => {
    if (cache.get(endpoint)?.promise === promise) cache.delete(endpoint);
  });
  return promise;
}

async function request<T>(endpoint: string): Promise<T> {
  try {
    let url = `${BASE_URL}${endpoint}`;
    if (endpoint.includes('?')) {
      const [path, query] = endpoint.split('?');
      url = `${BASE_URL}${path}.json?${query}`;
    } else {
      url = `${BASE_URL}${endpoint}.json`;
    }
    
    // Jolpica answers 429 when its rate limit is hit; back off and retry
    let response = await fetch(url);
    for (let attempt = 1; response.status === 429 && attempt <= MAX_RETRIES; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)));
      response = await fetch(url);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Error fetching from F1 API:', error);
    throw error;
  }
}
