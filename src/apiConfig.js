// In production, API calls go to the same domain (monolith) or configured URL
// In development, use localhost backend server
const isProduction = process.env.NODE_ENV === 'production';

// If explicitly compiled for a specific URL, use that. Otherwise derive relative or localhost.
export const API_URL = isProduction
    ? '/api'  // Relative path for same-origin deployment
    : 'http://localhost:5000/api';
