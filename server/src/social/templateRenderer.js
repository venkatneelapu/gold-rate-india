const sharp = require('sharp');
const { getDimensions } = require('./templates/primitives');

/**
 * Renders a template into SVG string and PNG Buffer
 * @param {object} template The template definition object
 * @param {object} data The prepared gold snapshot data
 * @param {string} format 'portrait' | 'square' | 'story'
 * @returns {Promise<{ svg: string, pngBuffer: Buffer, width: number, height: number }>}
 */
async function renderTemplate(template, data, format = 'portrait') {
  if (!template || typeof template.render !== 'function') {
    throw new Error(`Invalid template or missing render function for template: ${template?.id}`);
  }

  const { w, h } = getDimensions(format);

  // Generate SVG string from template
  const svg = template.render(data, format);

  try {
    // Convert SVG to PNG using sharp with 1:1 density/dimensions
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(w, h)
      .png({ compressionLevel: 8, quality: 95 })
      .toBuffer();

    return {
      svg,
      pngBuffer,
      width: w,
      height: h
    };
  } catch (err) {
    console.error(`[Renderer] Failed to render template ${template.id} to PNG:`, err);
    throw new Error(`PNG rendering failed for template ${template.id}: ${err.message}`);
  }
}

module.exports = {
  renderTemplate
};
