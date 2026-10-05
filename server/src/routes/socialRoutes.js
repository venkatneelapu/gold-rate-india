const express = require('express');
const path = require('path');
const fs = require('fs');
const socialPostService = require('../social/socialPostService');

const router = express.Router();

/**
 * GET /api/social-posts
 * Return list of all generated social posts (history)
 */
router.get('/', (req, res) => {
  try {
    const posts = socialPostService.getAllPosts();
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    console.error('[SocialRoutes] Failed to get posts:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/social-posts/latest
 * Return the latest generated post
 */
router.get('/latest', async (req, res) => {
  try {
    let latest = socialPostService.getLatestPost();
    
    // If no post exists yet, try auto-generating one if snapshot is ready
    if (!latest) {
      latest = await socialPostService.generateHourlyPost('portrait');
    }

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: 'No social post available yet. Awaiting verified gold snapshot.'
      });
    }

    return res.status(200).json({
      success: true,
      data: latest
    });
  } catch (err) {
    console.error('[SocialRoutes] Failed to get latest post:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/social-posts/templates
 * Return catalog of all available templates (50+ items)
 */
router.get('/templates', (req, res) => {
  try {
    const templates = socialPostService.getTemplateCatalog();
    return res.status(200).json({
      success: true,
      total: templates.length,
      data: templates
    });
  } catch (err) {
    console.error('[SocialRoutes] Failed to get templates:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/social-posts/generate
 * Generate another template for the current snapshot (or specified format/snapshot)
 * Body: { templateId?, format?, snapshotId? }
 */
router.post('/generate', async (req, res) => {
  try {
    const { templateId, format = 'portrait', snapshotId } = req.body || {};
    
    const post = await socialPostService.generateCustomPost({
      templateId: templateId || null,
      format,
      targetSnapshotId: snapshotId || null
    });

    return res.status(201).json({
      success: true,
      message: 'Social post generated successfully',
      data: post
    });
  } catch (err) {
    console.error('[SocialRoutes] Generation failed:', err);
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/social-posts/generate/:templateId
 * Generate a specific template for current snapshot
 */
router.post('/generate/:templateId', async (req, res) => {
  try {
    const { templateId } = req.params;
    const { format = 'portrait', snapshotId } = req.body || {};

    const post = await socialPostService.generateCustomPost({
      templateId,
      format,
      targetSnapshotId: snapshotId || null
    });

    return res.status(201).json({
      success: true,
      message: `Social post generated with template ${templateId}`,
      data: post
    });
  } catch (err) {
    console.error(`[SocialRoutes] Generation for template ${req.params.templateId} failed:`, err);
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/social-posts/:id/image
 * Serve the generated PNG directly for <img> tags
 */
router.get('/:id/image', (req, res) => {
  try {
    const { id } = req.params;
    const post = socialPostService.getPostById(id);

    if (!post || !post.imagePath || !fs.existsSync(post.imagePath)) {
      return res.status(404).json({
        success: false,
        error: 'Social post image not found on disk'
      });
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.sendFile(path.resolve(post.imagePath));
  } catch (err) {
    console.error('[SocialRoutes] Image serve error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/social-posts/:id/download
 * Download the generated PNG with proper attachment header
 */
router.get('/:id/download', (req, res) => {
  try {
    const { id } = req.params;
    const post = socialPostService.getPostById(id);

    if (!post || !post.imagePath || !fs.existsSync(post.imagePath)) {
      return res.status(404).json({
        success: false,
        error: 'Social post image not found on disk'
      });
    }

    const downloadFilename = post.filename || `gold-india-${id}.png`;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    return res.sendFile(path.resolve(post.imagePath));
  } catch (err) {
    console.error('[SocialRoutes] Download error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/social-posts/:id
 * Delete a post from history and disk
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = socialPostService.deletePost(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    return res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    console.error('[SocialRoutes] Delete error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
