const { escapeXml, formatINRNumber, getDimensions, COMMON_DEFS } = require('./primitives');

function getHeader(brandName, brandWebsite, dark = true) {
  const brandCol = dark ? '#D4AF37' : '#B8860B';
  const subCol = dark ? '#94A3B8' : '#64748B';
  return `
    <text x="540" y="100" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="4" fill="${brandCol}" text-anchor="middle" text-transform="uppercase">
      ${escapeXml(brandName || 'GOLD INDIA')}
    </text>
    <text x="540" y="125" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="${subCol}" text-anchor="middle">
      ${escapeXml(brandWebsite || 'www.goldrateindia.com')}
    </text>
  `;
}

function getRateNotice(rateType, y, dark = true) {
  const label = 'API MITRA MARKET RATE';
  const fill = dark ? '#1E293B' : '#F1F5F9';
  const textCol = dark ? '#ECC874' : '#854D0E';
  return `
    <rect x="260" y="${y - 18}" width="560" height="28" rx="14" fill="${fill}"/>
    <text x="540" y="${y + 1}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="${textCol}" text-anchor="middle">
      ${label}
    </text>
  `;
}

function getFooter(dateStr, timeStr, sourceStr, y, w = 1080, dark = true) {
  const lineCol = dark ? '#334155' : '#E2E8F0';
  const dateCol = dark ? '#F8FAFC' : '#0F172A';
  const subCol = dark ? '#64748B' : '#94A3B8';
  return `
    <g transform="translate(0, ${y})">
      <line x1="120" y1="0" x2="${w - 120}" y2="0" stroke="${lineCol}" stroke-width="1"/>
      <text x="120" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="700" fill="${dateCol}">
        ${escapeXml(dateStr || '5 October 2026')} • ${escapeXml(timeStr || '10:00 PM IST')}
      </text>
      <text x="${w - 120}" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="600" fill="${subCol}" text-anchor="end">
        Source: ${escapeXml(sourceStr || 'API Mitra')}
      </text>
      <text x="540" y="60" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="500" fill="${subCol}" text-anchor="middle">
        Indicative market reference · Actual retail prices may vary
      </text>
    </g>
  `;
}

// 11. Clean White
const template11 = {
  id: 'template-11',
  number: '11',
  name: 'Clean White',
  category: 'minimal',
  description: 'Crisp gallery white background with Swiss precision typography',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#FAFAFA"/>
        <rect x="60" y="60" width="${w - 120}" height="${h - 120}" rx="20" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5"/>

        ${getHeader(data.brandName, data.brandWebsite, false)}
        ${getRateNotice(data.rateType, 180, false)}

        <g transform="translate(540, ${cY})">
          <text x="0" y="-80" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="4" fill="#B8860B" text-anchor="middle">24K PURE GOLD</text>
          <text x="0" y="10" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="78" font-weight="900" fill="#111827" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="55" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#6B7280" text-anchor="middle">PER GRAM • 99.9% FINENESS</text>
        </g>

        <!-- Secondary Rates Light Box -->
        <g transform="translate(0, ${cY + 160})">
          <rect x="160" y="0" width="360" height="80" rx="16" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
          <text x="185" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="700" fill="#6B7280">22K STANDARD</text>
          <text x="185" y="62" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" fill="#111827">₹${formatINRNumber(data.gold22K)}/g</text>

          <rect x="560" y="0" width="360" height="80" rx="16" fill="#F9FAFB" stroke="#E5E7EB" stroke-width="1"/>
          <text x="585" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="700" fill="#6B7280">18K JEWELRY</text>
          <text x="585" y="62" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" fill="#111827">₹${formatINRNumber(data.gold18K)}/g</text>
        </g>

        ${getFooter(data.date, data.time, data.source, h - 110, w, false)}
      </svg>
    `;
  }
};

// 12. Minimal Gold
const template12 = {
  id: 'template-12',
  number: '12',
  name: 'Minimal Gold',
  category: 'minimal',
  description: 'Warm cream gold tone with dark modern grotesk type',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#FDFBF7"/>
        <line x1="80" y1="160" x2="${w - 80}" y2="160" stroke="#EADDC4" stroke-width="2"/>

        ${getHeader(data.brandName, data.brandWebsite, false)}
        ${getRateNotice(data.rateType, 210, false)}

        <g transform="translate(100, ${cY - 40})">
          <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="3" fill="#B8860B">RATE CARD • 24K SPOT</text>
          <text x="0" y="85" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="82" font-weight="900" fill="#1C1917">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="130" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="600" fill="#78716C">10g: ₹${formatINRNumber(data.gold10Grams24K)} • 1 Tola: ₹${formatINRNumber(data.goldTola24K)}</text>
        </g>

        ${getFooter(data.date, data.time, data.source, h - 110, w, false)}
      </svg>
    `;
  }
};

// 13. Editorial
const template13 = {
  id: 'template-13',
  number: '13',
  name: 'Editorial',
  category: 'minimal',
  description: 'High-fashion editorial layout with asymmetric type hierarchy',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#121212"/>
        <line x1="80" y1="0" x2="80" y2="${h}" stroke="#D4AF37" stroke-width="3"/>

        <g transform="translate(130, 120)">
          <text x="0" y="0" font-family="'Cinzel', serif" font-size="28" font-weight="800" fill="#D4AF37">THE BULLION REPORT</text>
          <text x="0" y="30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="600" fill="#71717A">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
        </g>

        ${getRateNotice(data.rateType, 220, true)}

        <g transform="translate(130, ${cY})">
          <text x="0" y="-40" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="4" fill="#A1A1AA">PURE GOLD (24K)</text>
          <text x="0" y="50" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="88" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="95" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="600" fill="#D4AF37">22K: ₹${formatINRNumber(data.gold22K)}/g  |  18K: ₹${formatINRNumber(data.gold18K)}/g</text>
        </g>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

// 14. Modern Grid
const template14 = {
  id: 'template-14',
  number: '14',
  name: 'Modern Grid',
  category: 'minimal',
  description: 'Structured architectural grid compartments',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#0F172A"/>
        
        ${getHeader(data.brandName, data.brandWebsite, true)}
        ${getRateNotice(data.rateType, 190, true)}

        <g transform="translate(80, ${cY - 120})">
          <rect x="0" y="0" width="${w - 160}" height="180" fill="#1E293B" rx="16" stroke="#334155" stroke-width="1.5"/>
          <text x="40" y="50" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" fill="#D4AF37">24 KARAT PURE GOLD</text>
          <text x="40" y="125" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="64" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}<tspan font-size="22" fill="#94A3B8">/g</tspan></text>
        </g>

        <g transform="translate(80, ${cY + 85})">
          <rect x="0" y="0" width="${(w - 180) / 2}" height="100" fill="#1E293B" rx="16" stroke="#334155" stroke-width="1"/>
          <text x="30" y="40" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">22K STANDARD</text>
          <text x="30" y="75" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold22K)}</text>

          <rect x="${(w - 180) / 2 + 20}" y="0" width="${(w - 180) / 2}" height="100" fill="#1E293B" rx="16" stroke="#334155" stroke-width="1"/>
          <text x="${(w - 180) / 2 + 50}" y="40" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">18K JEWELRY</text>
          <text x="${(w - 180) / 2 + 50}" y="75" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold18K)}</text>
        </g>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

// 15. Swiss Gold
const template15 = {
  id: 'template-15',
  number: '15',
  name: 'Swiss Gold',
  category: 'minimal',
  description: 'Legendary Swiss International Typographic Style',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#F4F4F5"/>
        <rect x="0" y="0" width="30" height="${h}" fill="#E11D48"/>

        <g transform="translate(80, 100)">
          <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" fill="#18181B">GOLD REPORT</text>
          <text x="0" y="24" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="700" fill="#71717A">SWISS BENCHMARK STANDARD</text>
        </g>

        ${getRateNotice(data.rateType, 180, false)}

        <g transform="translate(80, ${cY})">
          <text x="0" y="-50" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="800" fill="#18181B">24K RATE / GRAM</text>
          <text x="0" y="45" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="94" font-weight="900" fill="#18181B">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="90" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#52525B">22K: ₹${formatINRNumber(data.gold22K)}  •  18K: ₹${formatINRNumber(data.gold18K)}</text>
        </g>

        ${getFooter(data.date, data.time, data.source, h - 110, w, false)}
      </svg>
    `;
  }
};

// 16. Simple Market
const template16 = {
  id: 'template-16',
  number: '16',
  name: 'Simple Market',
  category: 'minimal',
  description: 'Hyper-focused uncluttered layout with centered large rate',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#18181B"/>
        ${getHeader(data.brandName, data.brandWebsite, true)}
        ${getRateNotice(data.rateType, 200, true)}

        <text x="540" y="${cY - 40}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#D4AF37" text-anchor="middle">CURRENT 24K SPOT</text>
        <text x="540" y="${cY + 50}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="86" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
        <text x="540" y="${cY + 95}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="600" fill="#A1A1AA" text-anchor="middle">PER GRAM</text>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

// 17. Elegant Type
const template17 = {
  id: 'template-17',
  number: '17',
  name: 'Elegant Type',
  category: 'minimal',
  description: 'Centered luxury typography with delicate hairline dividers',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#0C0A09"/>
        ${getHeader(data.brandName, data.brandWebsite, true)}
        ${getRateNotice(data.rateType, 200, true)}

        <line x1="340" y1="${cY - 80}" x2="740" y2="${cY - 80}" stroke="#D4AF37" stroke-width="1"/>
        <text x="540" y="${cY - 40}" font-family="'Cinzel', serif" font-size="22" font-weight="700" letter-spacing="6" fill="#D4AF37" text-anchor="middle">24 KARAT GOLD</text>
        <text x="540" y="${cY + 40}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="74" font-weight="900" fill="#FAFAF9" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
        <line x1="340" y1="${cY + 80}" x2="740" y2="${cY + 80}" stroke="#D4AF37" stroke-width="1"/>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

// 18. Minimal Dark
const template18 = {
  id: 'template-18',
  number: '18',
  name: 'Minimal Dark',
  category: 'minimal',
  description: 'Pure pitch black #000000 with razor-sharp contrast',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#000000"/>
        ${getHeader(data.brandName, data.brandWebsite, true)}
        ${getRateNotice(data.rateType, 190, true)}

        <text x="540" y="${cY - 20}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="800" fill="#D4AF37" text-anchor="middle">24K SPOT RATE</text>
        <text x="540" y="${cY + 65}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="82" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

// 19. Clean Numbers
const template19 = {
  id: 'template-19',
  number: '19',
  name: 'Clean Numbers',
  category: 'minimal',
  description: 'Hero oversized numbers taking pride of place',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#0F172A"/>
        ${getHeader(data.brandName, data.brandWebsite, true)}
        ${getRateNotice(data.rateType, 190, true)}

        <text x="540" y="${cY - 60}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="22" font-weight="800" fill="#F59E0B" text-anchor="middle">₹ PER GRAM</text>
        <text x="540" y="${cY + 50}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="110" font-weight="900" fill="#FFFFFF" text-anchor="middle">${formatINRNumber(data.gold24K)}</text>
        <text x="540" y="${cY + 100}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#94A3B8" text-anchor="middle">24K PURE GOLD • SPOT REFERENCE</text>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

// 20. Monochrome Gold
const template20 = {
  id: 'template-20',
  number: '20',
  name: 'Monochrome Gold',
  category: 'minimal',
  description: 'Refined golden amber monochromatic tones',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#171206"/>
        <rect x="50" y="50" width="${w - 100}" height="${h - 100}" rx="16" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.3"/>

        ${getHeader(data.brandName, data.brandWebsite, true)}
        ${getRateNotice(data.rateType, 200, true)}

        <text x="540" y="${cY - 40}" font-family="'Cinzel', serif" font-size="24" font-weight="700" fill="#ECC874" text-anchor="middle">GOLD 24K MONOCHROME</text>
        <text x="540" y="${cY + 45}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="78" font-weight="900" fill="#D4AF37" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
        <text x="540" y="${cY + 90}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#996515" text-anchor="middle">INR PER GRAM</text>

        ${getFooter(data.date, data.time, data.source, h - 110, w, true)}
      </svg>
    `;
  }
};

module.exports = [
  template11, template12, template13, template14, template15,
  template16, template17, template18, template19, template20
];
