const { escapeXml, formatINRNumber, getDimensions, COMMON_DEFS } = require('./primitives');

function getFinHeader(brandName, brandWebsite) {
  return `
    <g transform="translate(100, 100)">
      <circle cx="10" cy="10" r="8" fill="#10B981"/>
      <text x="32" y="17" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="900" fill="#F8FAFC" letter-spacing="2">
        ${escapeXml(brandName || 'GOLD INDIA')} <tspan fill="#38BDF8">MARKETS</tspan>
      </text>
      <text x="32" y="38" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748B">
        FINANCIAL INTELLIGENCE • ${escapeXml(brandWebsite || 'www.goldrateindia.com')}
      </text>
    </g>
  `;
}

function getFinRateNotice(rateType, y) {
  const label = 'API MITRA MARKET RATE';
  return `
    <rect x="100" y="${y - 18}" width="620" height="28" rx="6" fill="#1E293B"/>
    <text x="120" y="${y + 2}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="2" fill="#38BDF8">
      ● ${label}
    </text>
  `;
}

function getFinChangeBadge(change, changePct, isPos, x, y) {
  if (change === undefined || change === null || isNaN(change)) return '';
  const sign = isPos ? '▲ +' : '▼ -';
  const color = isPos ? '#10B981' : '#F43F5E';
  const bg = isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
  return `
    <rect x="${x}" y="${y - 20}" width="220" height="36" rx="8" fill="${bg}"/>
    <text x="${x + 110}" y="${y + 5}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" fill="${color}" text-anchor="middle">
      ${sign}₹${Math.abs(change).toFixed(2)} (${isPos ? '+' : ''}${changePct}%)
    </text>
  `;
}

function getFinSecondaryRates(p22, p18, y, w = 1080) {
  return `
    <g transform="translate(100, ${y})">
      <rect x="0" y="0" width="${w - 200}" height="84" rx="12" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <g transform="translate(40, 28)">
        <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="700" fill="#94A3B8">22K RATE</text>
        <text x="0" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(p22)}<tspan font-size="13" fill="#64748B">/g</tspan></text>
      </g>
      <line x1="440" y1="16" x2="440" y2="68" stroke="#334155" stroke-width="1"/>
      <g transform="translate(480, 28)">
        <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="700" fill="#94A3B8">18K RATE</text>
        <text x="0" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(p18)}<tspan font-size="13" fill="#64748B">/g</tspan></text>
      </g>
    </g>
  `;
}

function getFinFooter(dateStr, timeStr, sourceStr, y, w = 1080) {
  return `
    <g transform="translate(100, ${y})">
      <line x1="0" y1="0" x2="${w - 200}" y2="0" stroke="#334155" stroke-width="1"/>
      <text x="0" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="700" fill="#94A3B8">
        TIMESTAMP: <tspan fill="#F8FAFC">${escapeXml(dateStr || '5 October 2026')}, ${escapeXml(timeStr || '10:00 PM IST')}</tspan>
      </text>
      <text x="${w - 200}" y="32" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748B" text-anchor="end">
        FEED: ${escapeXml(sourceStr || 'API Mitra')}
      </text>
      <text x="${(w - 200) / 2}" y="60" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="500" fill="#475569" text-anchor="middle">
        Financial market reference • Actual retail jewellery billing differs by seller
      </text>
    </g>
  `;
}

// 31. Market Watch
const template31 = {
  id: 'template-31',
  number: '31',
  name: 'Market Watch',
  category: 'financial',
  description: 'Financial ticker with terminal candlestick background and live spot price',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0E17"/>
        <rect width="${w}" height="${h}" fill="url(#dotPattern)"/>

        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 185)}

        <g transform="translate(100, ${cY - 110})">
          <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="3" fill="#38BDF8">INDIAN GOLD MARKET RATE</text>
          <text x="0" y="80" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="78" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}<tspan font-size="26" fill="#94A3B8">/g</tspan></text>
          <text x="0" y="125" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#FBBF24">10 Grams: ₹${formatINRNumber(data.gold10Grams24K)}  •  1 Tola: ₹${formatINRNumber(data.goldTola24K)}</text>
          ${getFinChangeBadge(data.change24K, data.changePercent24K, data.isPositive, w - 440, 10)}
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 110, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 32. Bullion Report
const template32 = {
  id: 'template-32',
  number: '32',
  name: 'Bullion Report',
  category: 'financial',
  description: 'Institutional research note bulletin layout with structured metrics',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0F172A"/>
        <rect x="50" y="50" width="${w - 100}" height="${h - 100}" rx="16" fill="#1E293B" stroke="#334155" stroke-width="1.5"/>

        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 195)}

        <g transform="translate(100, ${cY - 60})">
          <text x="0" y="-30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" fill="#FBBF24">24K BENCHMARK FIX</text>
          <text x="0" y="45" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="74" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="85" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="600" fill="#94A3B8">Spot Troy Ounce: ₹${formatINRNumber(data.gold24K * 31.1034768)}</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 120, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 33. Gold Market Today
const template33 = {
  id: 'template-33',
  number: '33',
  name: 'Gold Market Today',
  category: 'financial',
  description: 'Bloomberg style financial headline banner with clean typography',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#111827"/>
        <rect x="0" y="0" width="${w}" height="8" fill="#F59E0B"/>

        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 190)}

        <g transform="translate(100, ${cY})">
          <text x="0" y="-45" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" fill="#9CA3AF">GOLD RATE SUMMARY • 24K</text>
          <text x="0" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="80" font-weight="900" fill="#F9FAFB">₹${formatINRNumber(data.gold24K)}<tspan font-size="28" fill="#6B7280">/g</tspan></text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 130, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 34. Daily Gold Index
const template34 = {
  id: 'template-34',
  number: '34',
  name: 'Daily Gold Index',
  category: 'financial',
  description: 'Index tracker with volatility indicators and high-impact rate card',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#090D16"/>
        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 195)}

        <g transform="translate(100, ${cY - 50})">
          <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="800" fill="#10B981">● INDEX LIVE SPOT</text>
          <text x="0" y="75" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="76" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="115" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="600" fill="#94A3B8">Converted directly from international spot bullion</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 130, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 35. Investor Brief
const template35 = {
  id: 'template-35',
  number: '35',
  name: 'Investor Brief',
  category: 'financial',
  description: 'Portfolio briefing format with clean multi-column metrics',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0F1D"/>
        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 200)}

        <g transform="translate(100, ${cY - 60})">
          <text x="0" y="-30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="3" fill="#FBBF24">PORTFOLIO REFERENCE • 24K</text>
          <text x="0" y="45" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="74" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}<tspan font-size="24" fill="#94A3B8">/g</tspan></text>
          <text x="0" y="90" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="700" fill="#38BDF8">10 Grams: ₹${formatINRNumber(data.gold10Grams24K)} | 1 Tola: ₹${formatINRNumber(data.goldTola24K)}</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 130, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 36. Market Pulse
const template36 = {
  id: 'template-36',
  number: '36',
  name: 'Market Pulse',
  category: 'financial',
  description: 'Dynamic pulse wave motif with immediate market status',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0B132B"/>
        <!-- Pulse Wave Line -->
        <path d="M 0 ${cY} L 300 ${cY} L 340 ${cY - 60} L 380 ${cY + 80} L 420 ${cY - 40} L 460 ${cY} L ${w} ${cY}" stroke="#10B981" stroke-width="2" stroke-opacity="0.25" fill="none"/>

        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 190)}

        <g transform="translate(100, ${cY - 60})">
          <text x="0" y="-30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="800" fill="#10B981">MARKET PULSE • 24K SPOT</text>
          <text x="0" y="45" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="76" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 130, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 37. Gold Tracker
const template37 = {
  id: 'template-37',
  number: '37',
  name: 'Gold Tracker',
  category: 'financial',
  description: 'Precision analytics card with dark blue dashboard styling',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#080C14"/>
        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 195)}

        <g transform="translate(100, ${cY})">
          <rect x="0" y="-120" width="${w - 200}" height="200" rx="16" fill="#111827" stroke="#1F2937" stroke-width="1.5"/>
          <text x="40" y="-65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" fill="#F59E0B">HOURLY TRACKER • 24K</text>
          <text x="40" y="15" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="64" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}<tspan font-size="22" fill="#9CA3AF">/g</tspan></text>
          <text x="40" y="55" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="600" fill="#6B7280">1 Tola (11.6638g): ₹${formatINRNumber(data.goldTola24K)}</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 140, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 38. Commodity Report
const template38 = {
  id: 'template-38',
  number: '38',
  name: 'Commodity Report',
  category: 'financial',
  description: 'Commodities trading desk bulletin with international bullion notes',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0E1A"/>
        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 190)}

        <g transform="translate(100, ${cY - 60})">
          <text x="0" y="-30" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="800" fill="#D4AF37">COMMODITY BENCHMARK</text>
          <text x="0" y="45" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="74" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 120, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 39. Daily Bullion
const template39 = {
  id: 'template-39',
  number: '39',
  name: 'Daily Bullion',
  category: 'financial',
  description: 'Trading desk clean pricing sheet',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0D1117"/>
        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 190)}

        <g transform="translate(100, ${cY - 50})">
          <text x="0" y="-20" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="800" fill="#38BDF8">DAILY BULLION SPOT</text>
          <text x="0" y="55" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="76" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 120, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 40. Gold Analytics
const template40 = {
  id: 'template-40',
  number: '40',
  name: 'Gold Analytics',
  category: 'financial',
  description: 'Fintech analytics card with clean telemetry visual accents',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0F1D"/>
        ${getFinHeader(data.brandName, data.brandWebsite)}
        ${getFinRateNotice(data.rateType, 190)}

        <g transform="translate(100, ${cY})">
          <text x="0" y="-40" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="800" fill="#10B981">ANALYTICS RATE SNAPSHOT</text>
          <text x="0" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="78" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}<tspan font-size="24" fill="#94A3B8">/g</tspan></text>
        </g>

        ${getFinSecondaryRates(data.gold22K, data.gold18K, cY + 130, w)}
        ${getFinFooter(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

module.exports = [
  template31, template32, template33, template34, template35,
  template36, template37, template38, template39, template40
];
