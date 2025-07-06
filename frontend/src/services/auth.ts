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
  return !!token;
};