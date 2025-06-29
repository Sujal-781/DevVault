export const getToken = (): string | null => {
  return localStorage.getItem('devvault_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('devvault_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('devvault_token');
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};