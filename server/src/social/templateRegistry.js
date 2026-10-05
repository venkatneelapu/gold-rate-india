const luxuryTemplates = require('./templates/luxuryTemplates');
const minimalTemplates = require('./templates/minimalTemplates');
const indianTemplates = require('./templates/indianTemplates');
const financialTemplates = require('./templates/financialTemplates');
const socialTemplates = require('./templates/socialTemplates');

// Combine all 55 templates
const ALL_TEMPLATES = [
  ...luxuryTemplates,
  ...minimalTemplates,
  ...indianTemplates,
  ...financialTemplates,
  ...socialTemplates
];

// Map by ID for quick O(1) lookup
const TEMPLATE_MAP = new Map();
ALL_TEMPLATES.forEach((tpl, idx) => {
  tpl.index = idx + 1;
  TEMPLATE_MAP.set(tpl.id, tpl);
});

/**
 * Returns all templates
 */
function getAllTemplates() {
  return ALL_TEMPLATES;
}

/**
 * Returns template list metadata without render functions (safe for JSON API serialization)
 */
function getTemplateCatalog() {
  return ALL_TEMPLATES.map(t => ({
    id: t.id,
    index: t.index,
    name: t.name,
    category: t.category,
    description: t.description || '',
    supportedFormats: t.supportedFormats || ['portrait', 'square', 'story']
  }));
}

/**
 * Finds a template by its unique string ID
 */
function getTemplateById(id) {
  return TEMPLATE_MAP.get(id) || null;
}

/**
 * Filters templates by category
 */
function getTemplatesByCategory(category) {
  if (!category || category === 'all') return ALL_TEMPLATES;
  return ALL_TEMPLATES.filter(t => t.category.toLowerCase() === category.toLowerCase());
}

/**
 * Selects a random template while avoiding recent consecutive selections
 * @param {Array<string>} excludedIds Array of recently used template IDs
 * @returns {object} The chosen template
 */
function selectRandomTemplate(excludedIds = []) {
  const excludedSet = new Set(excludedIds);
  let available = ALL_TEMPLATES.filter(t => !excludedSet.has(t.id));
  
  // If all are excluded, reset pool to all templates except the very last one if possible
  if (available.length === 0) {
    const lastId = excludedIds[excludedIds.length - 1];
    available = ALL_TEMPLATES.filter(t => t.id !== lastId);
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex] || ALL_TEMPLATES[0];
}

module.exports = {
  getAllTemplates,
  getTemplateCatalog,
  getTemplateById,
  getTemplatesByCategory,
  selectRandomTemplate
};
