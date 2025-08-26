import axios from 'axios';

// For development - use local backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Fetch dropdown options
export const fetchVendors = async () => {
  try {
    const response = await api.get('/sheets/vendors');
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw new Error('Failed to fetch vendors');
  }
};

export const fetchPumpCapacities = async (vendor) => {
  try {
    const response = await api.get(`/sheets/pump-capacities/${encodeURIComponent(vendor)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pump capacities:', error);
    throw new Error('Failed to fetch pump capacities');
  }
};

export const fetchPumpTypes = async (vendor, capacity) => {
  try {
    const response = await api.get(`/sheets/pump-types/${encodeURIComponent(vendor)}/${encodeURIComponent(capacity)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pump types:', error);
    throw new Error('Failed to fetch pump types');
  }
};

export const fetchMeterHeads = async (vendor, capacity, type) => {
  try {
    const response = await api.get(`/sheets/meter-heads/${encodeURIComponent(vendor)}/${encodeURIComponent(capacity)}/${encodeURIComponent(type)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meter heads:', error);
    throw new Error('Failed to fetch meter heads');
  }
};

// Calculate cost
export const calculateCost = async (formData) => {
  try {
    const response = await api.post('/calculator/calculate', formData);
    return response.data;
  } catch (error) {
    console.error('Error calculating cost:', error);
    throw new Error('Failed to calculate cost');
  }
};