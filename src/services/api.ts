const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}.json`;
    
    const response = await fetch(url);
    
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
