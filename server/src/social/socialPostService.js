const crypto = require('crypto');
const goldService = require('../services/goldService');
const { getAllTemplates, getTemplateById, getTemplateCatalog, selectRandomTemplate } = require('./templateRegistry');
const { renderTemplate } = require('./templateRenderer');
const { socialStorage } = require('./socialStorage');

const socialPostService = {
  /**
   * Retrieves the current verified snapshot strictly from API Mitra gold service.
   */
  getVerifiedSnapshot(cityName = 'Hyderabad') {
    const { city, snapshot } = goldService.getSnapshotForCity(cityName);
    if (!snapshot) {
      return null;
    }

    const price24K = snapshot.price24K;
    const price22K = snapshot.price22K;
    const price18K = snapshot.price18K;

    if (!price24K) return null;

    const priceChange = goldService.computePriceChange(city, snapshot);

    return {
      snapshotId: snapshot.id || `apimitra-${city.toLowerCase()}-${snapshot.rateDate}`,
      city,
      location: city,
      source: 'API Mitra',
      sourceLabel: 'API MITRA MARKET RATE',
      timestamp: snapshot.timestamp || Date.now(),
      date: snapshot.rateDate,
      time: snapshot.rateTime,
      price24K,
      price22K,
      price18K,
      price24K_10g: snapshot.price24K_10g || Math.round(price24K * 10),
      price22K_10g: snapshot.price22K_10g || Math.round(price22K * 10),
      price18K_10g: snapshot.price18K_10g || Math.round(price18K * 10),
      change24K: priceChange?.['24K']?.diff || 0,
      changePercent24K: priceChange?.['24K']?.percentage || 0,
      isCachedData: false
    };
  },

  /**
   * Automatic post generation triggered when an API Mitra price change is recorded.
   */
  async generateHourlyPost(format = 'portrait', cityName = 'India') {
    const snapshot = this.getVerifiedSnapshot(cityName);
    if (!snapshot) {
      console.warn('[SocialPostService] API Mitra data not available. Aborting social post generation.');
      return null;
    }

    // Idempotency: Check if a post already exists for this snapshot and format
    const existing = socialStorage.getPostBySnapshotAndFormat(snapshot.snapshotId, format);
    if (existing) {
      return existing;
    }

    const recentTemplateIds = socialStorage.getRecentTemplateIds(8);
    const template = selectRandomTemplate(recentTemplateIds);

    console.log(`[SocialPostService] Selected Template #${template.index} (${template.name}) for ${snapshot.city}`);

    return await this.createPostWithTemplate(snapshot, template, format, true);
  },

  /**
   * Generates or regenerates a post for the current API Mitra snapshot using another random or specified template.
   */
  async generateCustomPost({ templateId = null, format = 'portrait', targetSnapshotId = null, city = 'India' }) {
    let snapshot = null;

    if (targetSnapshotId) {
      const existing = socialStorage.getAllPosts().find(p => p.snapshotId === targetSnapshotId);
      if (existing) {
        snapshot = {
          snapshotId: existing.snapshotId,
          city: existing.city || city,
          location: existing.city || city,
          source: 'API Mitra',
          sourceLabel: 'API MITRA MARKET RATE',
          timestamp: existing.timestamp || Date.now(),
          date: existing.date,
          time: existing.time,
          price24K: existing.price24K,
          price22K: existing.price22K,
          price18K: existing.price18K,
          change24K: existing.change24K,
          changePercent24K: existing.changePercent24K
        };
      }
    }

    if (!snapshot) {
      snapshot = this.getVerifiedSnapshot(city);
    }

    if (!snapshot) {
      throw new Error('No API Mitra gold price snapshot available to generate post.');
    }

    let template = null;
    if (templateId) {
      template = getTemplateById(templateId);
      if (!template) {
        throw new Error(`Template not found with ID: ${templateId}`);
      }
    } else {
      const latest = socialStorage.getLatestPost();
      const excluded = latest ? [latest.templateId] : [];
      template = selectRandomTemplate(excluded);
    }

    return await this.createPostWithTemplate(snapshot, template, format, false);
  },

  /**
   * Internal render & storage routine
   */
  async createPostWithTemplate(snapshot, template, format = 'portrait', isAutoHourly = false) {
    const brandName = process.env.BRAND_NAME || 'Gold Rate India';
    const brandWebsite = process.env.BRAND_WEBSITE || 'https://goldrateindia.com';

    // Prepare template data payload - strictly API Mitra data with City
    const templateData = {
      brandName,
      brandWebsite,
      city: snapshot.city || 'Hyderabad',
      location: snapshot.city || 'Hyderabad',
      gold24K: snapshot.price24K,
      gold22K: snapshot.price22K,
      gold18K: snapshot.price18K,
      change24K: snapshot.change24K,
      changePercent24K: snapshot.changePercent24K,
      source: 'API Mitra',
      sourceLabel: 'API MITRA MARKET RATE',
      date: snapshot.date,
      time: snapshot.time,
      rateType: 'api-mitra',
      isCached: !!snapshot.isCachedData
    };

    // Render SVG and PNG
    const { pngBuffer, width, height } = await renderTemplate(template, templateData, format);

    const postId = `post_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    const metadata = {
      id: postId,
      snapshotId: snapshot.snapshotId,
      city: snapshot.city || 'Hyderabad',
      templateId: template.id,
      templateName: template.name,
      templateIndex: template.index,
      format,
      dimensions: { width, height },
      price24K: snapshot.price24K,
      price22K: snapshot.price22K,
      price18K: snapshot.price18K,
      change24K: snapshot.change24K,
      changePercent24K: snapshot.changePercent24K,
      source: 'API Mitra',
      sourceLabel: 'API MITRA MARKET RATE',
      date: snapshot.date,
      time: snapshot.time,
      isAutoHourly,
      generatedAt: new Date().toISOString()
    };

    const saved = await socialStorage.savePost(metadata, pngBuffer);
    console.log(`[SocialPostService] Successfully generated social post for ${snapshot.city}: ${saved.filename} (${format})`);
    return saved;
  },

  getLatestPost() {
    return socialStorage.getLatestPost();
  },

  getAllPosts() {
    return socialStorage.getAllPosts();
  },

  getPostById(id) {
    return socialStorage.getPostById(id);
  },

  deletePost(id) {
    return socialStorage.deletePost(id);
  },

  getTemplateCatalog() {
    return getTemplateCatalog();
  }
};

module.exports = socialPostService;
