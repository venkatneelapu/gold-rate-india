const fs = require('fs');
const path = require('path');

// Base directory for social storage: server/generated/social/
const BASE_STORAGE_DIR = path.resolve(__dirname, '../../generated/social');
const DB_FILE = path.join(BASE_STORAGE_DIR, 'posts.json');

// Ensure base storage directory exists
if (!fs.existsSync(BASE_STORAGE_DIR)) {
  fs.mkdirSync(BASE_STORAGE_DIR, { recursive: true });
}

// In-memory cache synced to JSON file
let postsCache = [];
let recentTemplateHistory = [];

/**
 * Load persisted posts from disk
 */
function loadFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      postsCache = Array.isArray(data.posts) ? data.posts : [];
      recentTemplateHistory = Array.isArray(data.recentTemplateIds) ? data.recentTemplateIds : [];
    } else {
      postsCache = [];
      recentTemplateHistory = [];
    }
  } catch (err) {
    console.error('[SocialStorage] Failed to read posts.json, initializing empty storage:', err);
    postsCache = [];
    recentTemplateHistory = [];
  }
}

/**
 * Persist in-memory state to disk
 */
function syncToDisk() {
  try {
    const data = {
      posts: postsCache,
      recentTemplateIds: recentTemplateHistory
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[SocialStorage] Failed to write posts.json:', err);
  }
}

// Initial load
loadFromDisk();

const socialStorage = {
  /**
   * Get all stored posts sorted by generation date desc
   */
  getAllPosts() {
    return [...postsCache].sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
  },

  /**
   * Get the most recently generated post
   */
  getLatestPost() {
    if (postsCache.length === 0) return null;
    return this.getAllPosts()[0];
  },

  /**
   * Get a post by its ID
   */
  getPostById(id) {
    return postsCache.find(p => p.id === id) || null;
  },

  /**
   * Check idempotency: Find post matching snapshotId and format
   */
  getPostBySnapshotAndFormat(snapshotId, format = 'portrait') {
    if (!snapshotId) return null;
    return postsCache.find(p => p.snapshotId === snapshotId && p.format === format) || null;
  },

  /**
   * Get recent template IDs to avoid repeats in random selection
   */
  getRecentTemplateIds(limit = 10) {
    return recentTemplateHistory.slice(-limit);
  },

  /**
   * Save a generated post and write PNG file to YYYY/MM/DD/
   */
  async savePost(postMetadata, pngBuffer) {
    const dateObj = new Date(postMetadata.generatedAt || Date.now());
    const year = dateObj.getFullYear().toString();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    // Directory: server/generated/social/YYYY/MM/DD/
    const targetDir = path.join(BASE_STORAGE_DIR, year, month, day);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Meaningful filename: gold-india-24k-YYYY-MM-DD-HHMM-template-XX-format.png
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    const templateClean = (postMetadata.templateId || 'template-01').replace('gold-', '');
    const filename = `gold-india-24k-${year}-${month}-${day}-${hours}${mins}-${templateClean}-${postMetadata.format}.png`;
    const fullFilePath = path.join(targetDir, filename);

    // Save PNG file to disk
    fs.writeFileSync(fullFilePath, pngBuffer);

    // Web-accessible paths
    const apiImageUrl = `/api/social-posts/${postMetadata.id}/image`;
    const staticUrlPath = `/generated/social/${year}/${month}/${day}/${filename}`;

    const record = {
      id: postMetadata.id,
      snapshotId: postMetadata.snapshotId,
      city: postMetadata.city || 'Hyderabad',
      templateId: postMetadata.templateId,
      templateName: postMetadata.templateName || '',
      templateIndex: postMetadata.templateIndex || 1,
      format: postMetadata.format || 'portrait',
      dimensions: postMetadata.dimensions || { width: 1080, height: 1350 },
      imagePath: fullFilePath,
      imageUrl: apiImageUrl,
      staticUrl: staticUrlPath,
      filename: filename,
      price24K: postMetadata.price24K,
      price22K: postMetadata.price22K,
      price18K: postMetadata.price18K,
      change24K: postMetadata.change24K || 0,
      changePercent24K: postMetadata.changePercent24K || 0,
      source: postMetadata.source,
      sourceLabel: postMetadata.sourceLabel,
      date: postMetadata.date,
      time: postMetadata.time,
      isAutoHourly: !!postMetadata.isAutoHourly,
      generatedAt: postMetadata.generatedAt || new Date().toISOString()
    };

    // Prepend or replace if same ID
    const existingIndex = postsCache.findIndex(p => p.id === record.id);
    if (existingIndex >= 0) {
      postsCache[existingIndex] = record;
    } else {
      postsCache.unshift(record);
    }

    // Keep history of template IDs (limit to last 50)
    recentTemplateHistory.push(record.templateId);
    if (recentTemplateHistory.length > 50) {
      recentTemplateHistory.shift();
    }

    syncToDisk();
    return record;
  },

  /**
   * Delete a post by ID (and delete the image file from disk)
   */
  deletePost(id) {
    const post = this.getPostById(id);
    if (!post) return false;

    if (post.imagePath && fs.existsSync(post.imagePath)) {
      try {
        fs.unlinkSync(post.imagePath);
      } catch (e) {
        console.error(`[SocialStorage] Failed to remove image file ${post.imagePath}:`, e);
      }
    }

    postsCache = postsCache.filter(p => p.id !== id);
    syncToDisk();
    return true;
  }
};

module.exports = {
  socialStorage
};
