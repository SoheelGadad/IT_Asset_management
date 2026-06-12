// src/api.js

/**
 * 🌐 BASE API URL CONFIGURATION
 * * In Production (Azure): Uses an empty string "" so requests are relative to the hosted domain.
 * In Development (Local): Uses the VITE_API_URL env variable if provided. 
 * Otherwise, defaults to an empty string so Vite's dev proxy handles it smoothly.
 */
export const API_BASE_URL = import.meta.env.PROD 
  ? "" 
  : (import.meta.env.VITE_API_URL || "");

/**
 * 🛠️ Utility to build safe, clean API endpoints without double-slashes
 * @param {string} endpoint - The target path (e.g., 'api/login' or '/api/login')
 * @returns {string} Fully formatted API URL
 */
export const getApiUrl = (endpoint) => {
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If API_BASE_URL is empty, return just the clean relative endpoint (e.g., "/api/login")
  return `${API_BASE_URL}${cleanEndpoint}`;
};