const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const MAX_RETRIES = 3;

export async function fetchFromAPI<T>(endpoint: string): Promise<T> {
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
