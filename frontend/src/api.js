// src/api.js

// If we are running locally (DEV), use localhost. 
// If we are on Azure (PROD), use an empty string so it uses relative paths.
export const API_BASE_URL = import.meta.env.DEV 
  ? "http://localhost:5001" 
  : (import.meta.env.VITE_API_URL || "");

export const getApiUrl = (endpoint) => {
  // Safe-check: Ensure there isn't a double slash if endpoint starts with '/'
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};