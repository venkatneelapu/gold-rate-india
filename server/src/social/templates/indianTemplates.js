const { escapeXml, formatINRNumber, getDimensions, COMMON_DEFS, getMandalaSvg } = require('./primitives');

function getIndianHeader(brandName, brandWebsite) {
  return `
    <text x="540" y="105" font-family="'Cinzel', serif" font-size="22" font-weight="900" letter-spacing="6" fill="#FBBF24" text-anchor="middle">
      ${escapeXml(brandName || 'GOLD INDIA')}
    </text>
    <text x="540" y="132" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="2" fill="#FDE68A" text-anchor="middle">
      ${escapeXml(brandWebsite || 'www.goldrateindia.com')}
    </text>
  `;
}

function getRateNotice(rateType, y) {
  const label = 'API MITRA MARKET RATE';
  return `
    <rect x="250" y="${y - 18}" width="580" height="30" rx="15" fill="#78350F" fill-opacity="0.8" stroke="#FBBF24" stroke-width="1"/>
    <text x="540" y="${y + 2}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="#FEF3C7" text-anchor="middle">
      ${label}
    </text>
  `;
}

function getSecondaryRates(p22, p18, y, w = 1080) {
  return `
    <g transform="translate(0, ${y})">
      <rect x="140" y="0" width="380" height="90" rx="20" fill="#451A03" fill-opacity="0.75" stroke="#92400E" stroke-width="1.5"/>
      <text x="175" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="700" fill="#FCD34D">22K BRIDAL GOLD</text>
      <text x="175" y="68" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(p22)}<tspan font-size="14" fill="#FDE68A">/g</tspan></text>

      <rect x="560" y="0" width="380" height="90" rx="20" fill="#451A03" fill-opacity="0.75" stroke="#92400E" stroke-width="1.5"/>
      <text x="595" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="700" fill="#FCD34D">18K STUDDED GOLD</text>
      <text x="595" y="68" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(p18)}<tspan font-size="14" fill="#FDE68A">/g</tspan></text>
    </g>
  `;
}

function getIndianFooter(dateStr, timeStr, sourceStr, y, w = 1080) {
  return `
    <g transform="translate(0, ${y})">
      <line x1="140" y1="0" x2="${w - 140}" y2="0" stroke="#92400E" stroke-width="1"/>
      <text x="140" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#FEF3C7">
        🪔 ${escapeXml(dateStr || '5 October 2026')} • ${escapeXml(timeStr || '10:00 PM IST')}
      </text>
      <text x="${w - 140}" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="600" fill="#FDE68A" text-anchor="end">
        Source: ${escapeXml(sourceStr || 'API Mitra')}
      </text>
      <text x="540" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="500" fill="#D97706" text-anchor="middle">
        Indicative market reference · Actual retail prices may vary
      </text>
    </g>
  `;
}

// 21. Indian Heritage
const template21 = {
  id: 'template-21',
  number: '21',
  name: 'Indian Heritage',
  category: 'indian',
  description: 'Deep royal crimson with glowing gold mandala medallion and temple borders',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#2A0B0B"/>
        <rect x="35" y="35" width="${w - 70}" height="${h - 70}" rx="24" fill="none" stroke="#D4AF37" stroke-width="2"/>
        <rect x="45" y="45" width="${w - 90}" height="${h - 90}" rx="18" fill="none" stroke="#F59E0B" stroke-opacity="0.4" stroke-width="1" stroke-dasharray="6,6"/>

        ${getMandalaSvg(540, cY - 70, 240, '#D4AF37', 0.28)}

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 195)}

        <g transform="translate(540, ${cY - 60})">
          <circle cx="0" cy="0" r="160" fill="#1C0606" stroke="#F59E0B" stroke-width="2"/>
          <text x="0" y="-35" font-family="'Cinzel', serif" font-size="22" font-weight="800" fill="#FDE68A" text-anchor="middle">24K PURE GOLD</text>
          <text x="0" y="25" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="54" font-weight="900" fill="#FFFBEB" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="60" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#FCD34D" text-anchor="middle">RATE PER GRAM</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 160, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 22. Diwali Gold
const template22 = {
  id: 'template-22',
  number: '22',
  name: 'Diwali Gold',
  category: 'indian',
  description: 'Festive glowing diya and auspicious golden aura',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#1F0808"/>
        <!-- Diya Flame Silhouette Top -->
        <g transform="translate(540, 220) scale(1.4)">
          <path d="M 0 -25 C 10 -15 15 -5 10 10 C 5 20 -5 20 -10 10 C -15 -5 -10 -15 0 -25 Z" fill="#F59E0B" opacity="0.9"/>
          <path d="M 0 -15 C 5 -8 8 -2 5 6 C 2 12 -2 12 -5 6 C -8 -2 -5 -8 0 -15 Z" fill="#FEF08A"/>
          <path d="M -30 15 Q 0 35 30 15 Z" fill="#D97706"/>
        </g>

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 300)}

        <g transform="translate(540, ${cY + 40})">
          <text x="0" y="-55" font-family="'Cinzel', serif" font-size="24" font-weight="800" fill="#FCD34D" text-anchor="middle">SHUBH DIWALI BULLION</text>
          <text x="0" y="20" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="70" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FDE68A" text-anchor="middle">24K PURE GOLD / GRAM</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 180, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 23. Temple Gold
const template23 = {
  id: 'template-23',
  number: '23',
  name: 'Temple Gold',
  category: 'indian',
  description: 'Traditional temple gold gopuram inspired architectural frame',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#2E1005"/>
        <polygon points="540,50 960,180 960,${h - 60} 120,${h - 60} 120,180" fill="none" stroke="#D4AF37" stroke-width="2"/>

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 220)}

        <g transform="translate(540, ${cY})">
          <text x="0" y="-40" font-family="'Cinzel', serif" font-size="26" font-weight="800" fill="#FBBF24" text-anchor="middle">TEMPLE STANDARD 24K</text>
          <text x="0" y="30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="72" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FDE68A" text-anchor="middle">1 TOLA (11.6638g): ₹${formatINRNumber(data.goldTola24K)}</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 170, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 24. Traditional Gold
const template24 = {
  id: 'template-24',
  number: '24',
  name: 'Traditional Gold',
  category: 'indian',
  description: 'Warm auspicious marigold floral garland border and classic type',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#3B0D0C"/>
        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 200)}

        <g transform="translate(540, ${cY})">
          <rect x="-350" y="-130" width="700" height="260" rx="24" fill="#200606" stroke="#D4AF37" stroke-width="2"/>
          <text x="0" y="-60" font-family="'Cinzel', serif" font-size="24" font-weight="800" fill="#FBBF24" text-anchor="middle">TRADITIONAL 24K SPOT</text>
          <text x="0" y="25" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="68" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FCD34D" text-anchor="middle">PER GRAM • PURE BULLION</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 180, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 25. Mandala Gold
const template25 = {
  id: 'template-25',
  number: '25',
  name: 'Mandala Gold',
  category: 'indian',
  description: 'Full-bleed geometric sacred mandala background with floating rate card',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#1A0707"/>
        ${getMandalaSvg(540, cY, 380, '#D4AF37', 0.18)}

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 190)}

        <g transform="translate(540, ${cY})">
          <circle cx="0" cy="0" r="170" fill="#290B0B" stroke="#D4AF37" stroke-width="2" filter="url(#goldGlowFilter)"/>
          <text x="0" y="-30" font-family="'Cinzel', serif" font-size="20" font-weight="800" fill="#FBBF24" text-anchor="middle">MANDALA 24K</text>
          <text x="0" y="30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="56" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#FDE68A" text-anchor="middle">INR PER GRAM</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 210, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 26. Royal India
const template26 = {
  id: 'template-26',
  number: '26',
  name: 'Royal India',
  category: 'indian',
  description: 'Imperial Mughal emerald and gold regal frame',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#061F17"/>
        <rect x="40" y="40" width="${w - 80}" height="${h - 80}" rx="24" fill="none" stroke="#D4AF37" stroke-width="2"/>

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 195)}

        <g transform="translate(540, ${cY})">
          <text x="0" y="-45" font-family="'Cinzel', serif" font-size="24" font-weight="800" fill="#D4AF37" text-anchor="middle">IMPERIAL GOLD RESERVE</text>
          <text x="0" y="25" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="72" font-weight="900" fill="#ECFDF5" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="68" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#6EE7B7" text-anchor="middle">24K PURE SPOT EQUIVALENT</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 160, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 27. Indian Ornament
const template27 = {
  id: 'template-27',
  number: '27',
  name: 'Indian Ornament',
  category: 'indian',
  description: 'Artisanal jewellery filigree and paisley inspired border accents',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#1F0D05"/>
        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 200)}

        <g transform="translate(540, ${cY})">
          <text x="0" y="-40" font-family="'Cinzel', serif" font-size="22" font-weight="800" fill="#FBBF24" text-anchor="middle">ORNAMENTAL JEWELLERY BENCHMARK</text>
          <text x="0" y="30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="70" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FDE68A" text-anchor="middle">PER GRAM • 1 TOLA: ₹${formatINRNumber(data.goldTola24K)}</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 170, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 28. Festive Gold
const template28 = {
  id: 'template-28',
  number: '28',
  name: 'Festive Gold',
  category: 'indian',
  description: 'Festive sunburst rays and auspicious celebration banners',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#2E0812"/>
        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 200)}

        <g transform="translate(540, ${cY})">
          <text x="0" y="-45" font-family="'Cinzel', serif" font-size="26" font-weight="800" fill="#FBBF24" text-anchor="middle">FESTIVE GOLD WATCH</text>
          <text x="0" y="25" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="68" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FDE68A" text-anchor="middle">8G (PAVAN): ₹${formatINRNumber(data.gold24K * 8)}</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 160, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 29. Silk & Gold
const template29 = {
  id: 'template-29',
  number: '29',
  name: 'Silk & Gold',
  category: 'indian',
  description: 'Deep maroon silk texture with pure gold zari borders',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#1C060D"/>
        <!-- Zari Border Top and Bottom -->
        <rect x="0" y="0" width="${w}" height="18" fill="url(#goldLinear)"/>
        <rect x="0" y="${h - 18}" width="${w}" height="18" fill="url(#goldLinear)"/>

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 190)}

        <g transform="translate(540, ${cY})">
          <text x="0" y="-40" font-family="'Cinzel', serif" font-size="24" font-weight="800" fill="#D4AF37" text-anchor="middle">ZARI GOLD 24K</text>
          <text x="0" y="30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="74" font-weight="900" fill="#FFF1F2" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FDA4AF" text-anchor="middle">PER GRAM RATE</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 170, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 30. Heritage Pattern
const template30 = {
  id: 'template-30',
  number: '30',
  name: 'Heritage Pattern',
  category: 'indian',
  description: 'Intricate Indian jaali lattice pattern with central rate badge',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#240E06"/>
        <rect width="${w}" height="${h}" fill="url(#diagGrid)" opacity="0.4"/>

        ${getIndianHeader(data.brandName, data.brandWebsite)}
        ${getRateNotice(data.rateType, 200)}

        <g transform="translate(540, ${cY})">
          <rect x="-340" y="-120" width="680" height="240" rx="20" fill="#140602" stroke="#D4AF37" stroke-width="2"/>
          <text x="0" y="-50" font-family="'Cinzel', serif" font-size="22" font-weight="800" fill="#FBBF24" text-anchor="middle">HERITAGE LATTICE 24K</text>
          <text x="0" y="25" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="66" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#FDE68A" text-anchor="middle">PER GRAM • 10G: ₹${formatINRNumber(data.gold10Grams24K)}</text>
        </g>

        ${getSecondaryRates(data.gold22K, data.gold18K, cY + 175, w)}
        ${getIndianFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

module.exports = [
  template21, template22, template23, template24, template25,
  template26, template27, template28, template29, template30
];
