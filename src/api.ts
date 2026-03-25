export const apiFetch = async (path: string, options?: RequestInit) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.redwire.work/v1';
  const apiKey = import.meta.env.VITE_API_KEY || 'dummy_key';
  
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    throw { status: response.status, data: errorData };
  }

  return response.json();
};
