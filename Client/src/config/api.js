/**
 * Centralized API configuration for the Client.
 * Reads backend URL from environment variables (Vite requires VITE_ prefix).
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Remove trailing slash if present to avoid duplicate slashes in endpoints
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const API_ENDPOINTS = {
  CHATBOT: `${API_BASE_URL}/api/chatbot`,
  PREDICT: `${API_BASE_URL}/api/predict`,
  ANALYZE: `${API_BASE_URL}/api/analyze`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
