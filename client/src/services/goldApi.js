import axios from 'axios';

const API_BASE = '/api/gold';

export const TOLA_IN_GRAMS = 11.6638125;
export const PAVAN_IN_GRAMS = 8.0;

/**
 * Format number into Indian Rupee Currency string: ₹1,23,456.78
 */
export const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date in IST (Indian Standard Time): e.g. "5 October 2026, 6:00 PM IST"
 */
export const formatISTDateTime = (dateValue) => {
  if (!dateValue) return 'Unknown';
  try {
    const date = new Date(dateValue);
    const datePart = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);

    const timePart = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);

    return `${datePart}, ${timePart} IST`;
  } catch (err) {
    return String(dateValue);
  }
};

/**
 * Relative time ago
 */
export const timeAgo = (dateValue) => {
  if (!dateValue) return 'recently';
  const now = Date.now();
  const past = new Date(dateValue).getTime();
  const diffSeconds = Math.max(0, Math.floor((now - past) / 1000));

  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

/**
 * Fetch Indian gold rates overview from API Mitra for selected city
 */
export const getGoldOverview = async (city = 'India') => {
  const response = await axios.get(API_BASE, {
    params: { city },
    headers: { 'Cache-Control': 'no-cache' }
  });
  return response.data;
};

/**
 * Fetch historical gold rates from API Mitra for selected city
 */
export const getGoldHistory = async (city = 'India') => {
  const response = await axios.get(`${API_BASE}/history`, {
    params: { city }
  });
  return response.data;
};

/**
 * Fetch supported Indian cities from API Mitra
 */
export const getAvailableCities = async () => {
  const response = await axios.get(`${API_BASE}/cities`);
  return response.data?.cities || [];
};

/**
 * Trigger manual refresh (5m cooldown protected)
 */
export const refreshGoldRates = async () => {
  try {
    const response = await axios.post(`${API_BASE}/refresh`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    if (error.response && error.response.status === 429) {
      return {
        success: false,
        isRateLimited: true,
        retryAfter: error.response.data.retryAfter || 300,
        message: error.response.data.error || 'Cooldown active. Please wait a few minutes before refreshing again.'
      };
    }
    throw error;
  }
};
