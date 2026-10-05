import axios from 'axios';

const API_BASE = '/api/social-posts';

/**
 * Fetch the latest generated social post
 */
export const getLatestSocialPost = async () => {
  const response = await axios.get(`${API_BASE}/latest`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  return response.data?.data || null;
};

/**
 * Fetch history of all generated social posts
 */
export const getAllSocialPosts = async () => {
  const response = await axios.get(API_BASE, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  return response.data?.data || [];
};

/**
 * Fetch all 50+ templates catalog
 */
export const getTemplateCatalog = async () => {
  const response = await axios.get(`${API_BASE}/templates`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  return response.data?.data || [];
};

/**
 * Generate another random or specified template for the current snapshot
 */
export const generateSocialPost = async ({ templateId = null, format = 'portrait', snapshotId = null } = {}) => {
  const response = await axios.post(`${API_BASE}/generate`, {
    templateId,
    format,
    snapshotId
  });
  return response.data?.data;
};

/**
 * Generate a specific template by ID
 */
export const generateSpecificTemplate = async (templateId, { format = 'portrait', snapshotId = null } = {}) => {
  const response = await axios.post(`${API_BASE}/generate/${templateId}`, {
    format,
    snapshotId
  });
  return response.data?.data;
};

/**
 * Delete a post from history
 */
export const deleteSocialPost = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data?.success;
};

/**
 * Get direct download URL for a post
 */
export const getDownloadUrl = (id) => {
  return `${API_BASE}/${id}/download`;
};
