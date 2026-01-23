// Utility functions for authentication and token management

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Refresh the access token using the refresh token
 * @returns The new access token or null if refresh failed
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem('accessToken', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refreshToken', data.refresh_token);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

/**
 * Make an authenticated fetch request with automatic token refresh on 401
 * @param url The URL to fetch
 * @param options Fetch options
 * @param isRetry Internal flag to prevent infinite retry loops
 * @returns The fetch response
 * @throws Error if no access token is available
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  isRetry: boolean = false
): Promise<Response> => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    // Return a 401-like response instead of throwing
    return new Response(JSON.stringify({ error: 'No access token available' }), {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // If 401 and we haven't retried yet, try refreshing the token
  if (response.status === 401 && !isRetry) {
    console.log('Token expired, attempting to refresh...');
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with the new token
      return authenticatedFetch(url, options, true);
    }
  }

  return response;
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
