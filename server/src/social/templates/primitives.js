/**
 * Shared Design Primitives for Social Templates
 */

function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function formatINRNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0.00';
  const parts = Number(num).toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${formattedInt}.${decimalPart}`;
}

function getDimensions(format = 'portrait') {
  switch (format) {
    case 'square':
      return { w: 1080, h: 1080, name: '1080×1080' };
    case 'story':
      return { w: 1080, h: 1920, name: '1080×1920' };
    case 'portrait':
    default:
      return { w: 1080, h: 1350, name: '1080×1350' };
  }
}

const COMMON_DEFS = `
  <defs>
    <!-- Metallic Gold Gradient -->
    <linearGradient id="metallicGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#bf953f" />
      <stop offset="25%" stop-color="#fcf6ba" />
      <stop offset="50%" stop-color="#b38728" />
      <stop offset="75%" stop-color="#fbf5b7" />
      <stop offset="100%" stop-color="#aa771c" />
    </linearGradient>

    <!-- Warm Amber Glow -->
    <linearGradient id="warmGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>

    <!-- Dark Luxury Backdrop -->
    <linearGradient id="luxuryDarkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#121316" />
      <stop offset="50%" stop-color="#0a0a0c" />
      <stop offset="100%" stop-color="#050506" />
    </linearGradient>

    <!-- Royal Velvet Maroon -->
    <linearGradient id="royalVelvetBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a080c" />
      <stop offset="50%" stop-color="#150204" />
      <stop offset="100%" stop-color="#090102" />
    </linearGradient>

    <!-- Deep Navy Gradient -->
    <linearGradient id="deepNavyBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1329" />
      <stop offset="50%" stop-color="#060a17" />
      <stop offset="100%" stop-color="#02040a" />
    </linearGradient>

    <!-- Radial Gold Glow -->
    <radialGradient id="goldAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#d97706" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Subtle Geometric Grid Pattern -->
    <pattern id="luxGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d4af37" stroke-width="0.75" stroke-opacity="0.07" />
    </pattern>

    <!-- Diagonal Line Texture -->
    <pattern id="diagLines" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.05" />
    </pattern>
  </defs>
`;

function getCornerOrnaments(w, h, size = 60, stroke = '#d4af37') {
  return `
    <g stroke="${stroke}" stroke-width="2" fill="none" stroke-linecap="round">
      <!-- Top Left -->
      <path d="M 40 ${40 + size} L 40 40 L ${40 + size} 40" />
      <circle cx="40" cy="40" r="3" fill="${stroke}" />

      <!-- Top Right -->
      <path d="M ${w - 40 - size} 40 L ${w - 40} 40 L ${w - 40} ${40 + size}" />
      <circle cx="${w - 40}" cy="40" r="3" fill="${stroke}" />

      <!-- Bottom Left -->
      <path d="M 40 ${h - 40 - size} L 40 ${h - 40} L ${40 + size} ${h - 40}" />
      <circle cx="40" cy="${h - 40}" r="3" fill="${stroke}" />

      <!-- Bottom Right -->
      <path d="M ${w - 40 - size} ${h - 40} L ${w - 40} ${h - 40} L ${w - 40} ${h - 40 - size}" />
      <circle cx="${w - 40}" cy="${h - 40}" r="3" fill="${stroke}" />
    </g>
  `;
}

function getMandalaSvg(cx, cy, r = 180, color = '#d4af37', opacity = 0.12) {
  let petals = '';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = cx + Math.cos(angle) * (r * 0.4);
    const y1 = cy + Math.sin(angle) * (r * 0.4);
    const x2 = cx + Math.cos(angle) * r;
    const y2 = cy + Math.sin(angle) * r;
    petals += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" stroke-opacity="${opacity}" />`;
    petals += `<circle cx="${x2}" cy="${y2}" r="4" fill="${color}" fill-opacity="${opacity}" />`;
  }

  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.25}" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="${opacity}" />
      <circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="${opacity}" />
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="${opacity}" />
      ${petals}
    </g>
  `;
}

module.exports = {
  escapeXml,
  formatINRNumber,
  getDimensions,
  COMMON_DEFS,
  getCornerOrnaments,
  getMandalaSvg
};
