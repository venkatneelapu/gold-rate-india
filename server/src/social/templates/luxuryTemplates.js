const { escapeXml, formatINRNumber, getDimensions, COMMON_DEFS, getCornerOrnaments } = require('./primitives');

function getHeaderBrand(brandName, brandWebsite) {
  return `
    <text x="540" y="110" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#D4AF37" text-anchor="middle" text-transform="uppercase">
      ${escapeXml(brandName || 'GOLD INDIA')}
    </text>
    <text x="540" y="138" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="2" fill="#94A3B8" text-anchor="middle">
      ${escapeXml(brandWebsite || 'www.goldrateindia.com')}
    </text>
  `;
}

function getRateTypeNotice(rateType, y) {
  const label = 'API MITRA MARKET RATE';
  return `
    <rect x="240" y="${y - 20}" width="600" height="32" rx="16" fill="#D4AF37" fill-opacity="0.12" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1"/>
    <text x="540" y="${y + 2}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="2" fill="#ECC874" text-anchor="middle">
      ${label}
    </text>
  `;
}

function getPriceChangeBadge(change, changePct, isPos, x, y) {
  if (change === undefined || change === null || isNaN(change)) return '';
  const sign = isPos ? '▲ +' : '▼ -';
  const color = isPos ? '#10B981' : '#F43F5E';
  const bg = isPos ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';
  const border = isPos ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)';
  return `
    <rect x="${x - 140}" y="${y - 24}" width="280" height="42" rx="21" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
    <text x="${x}" y="${y + 5}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" fill="${color}" text-anchor="middle">
      ${sign}₹${Math.abs(change).toFixed(2)} (${isPos ? '+' : ''}${changePct}%)
    </text>
  `;
}

function getSecondaryRatesBar(p22, p18, y, w = 1080) {
  return `
    <g transform="translate(0, ${y})">
      <rect x="140" y="0" width="380" height="90" rx="20" fill="#1E293B" fill-opacity="0.6" stroke="#334155" stroke-width="1"/>
      <text x="175" y="36" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">22K STANDARD</text>
      <text x="175" y="68" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(p22)}<tspan font-size="14" fill="#94A3B8">/g</tspan></text>

      <rect x="560" y="0" width="380" height="90" rx="20" fill="#1E293B" fill-opacity="0.6" stroke="#334155" stroke-width="1"/>
      <text x="595" y="36" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#94A3B8">18K JEWELRY</text>
      <text x="595" y="68" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="26" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(p18)}<tspan font-size="14" fill="#94A3B8">/g</tspan></text>
    </g>
  `;
}

function getFooterMeta(dateStr, timeStr, sourceStr, y, w = 1080) {
  return `
    <g transform="translate(0, ${y})">
      <line x1="140" y1="0" x2="${w - 140}" y2="0" stroke="#334155" stroke-opacity="0.6" stroke-width="1"/>
      <text x="140" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#F8FAFC">
        📅 ${escapeXml(dateStr || '5 October 2026')} • ${escapeXml(timeStr || '10:00 PM IST')}
      </text>
      <text x="${w - 140}" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="13" font-weight="600" fill="#94A3B8" text-anchor="end">
        Source: ${escapeXml(sourceStr || 'API Mitra')}
      </text>
      <text x="540" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="500" fill="#64748B" text-anchor="middle">
        Indicative market reference · Actual retail prices may vary
      </text>
    </g>
  `;
}

// 1. Royal Gold
const template01 = {
  id: 'template-01',
  number: '01',
  name: 'Royal Gold',
  category: 'luxury',
  description: 'Deep imperial black with double gold filigree borders and Roman serif styling',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    const p24 = formatINRNumber(data.gold24K);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#080B11"/>
        <rect width="${w}" height="${h}" fill="url(#goldRadialGlow)"/>

        <!-- Double Ornate Border -->
        <rect x="30" y="30" width="${w - 60}" height="${h - 60}" rx="12" fill="none" stroke="url(#goldLinear)" stroke-width="2"/>
        <rect x="42" y="42" width="${w - 84}" height="${h - 84}" rx="8" fill="none" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="6,6"/>
        ${getCornerOrnaments(w, h, 50, 50)}

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 190)}

        <!-- Center 24K Bullion Shield -->
        <g transform="translate(0, ${cY - 120})">
          <circle cx="540" cy="0" r="160" fill="#0E1626" stroke="url(#goldLinear)" stroke-width="2" filter="url(#goldGlowFilter)"/>
          <text x="540" y="-30" font-family="'Cinzel', serif" font-size="28" font-weight="700" letter-spacing="6" fill="#D4AF37" text-anchor="middle">24K PURE GOLD</text>
          <text x="540" y="35" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="58" font-weight="900" fill="url(#goldShine)" text-anchor="middle">₹${p24}</text>
          <text x="540" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="#94A3B8" text-anchor="middle">PER GRAM</text>
        </g>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, 540, cY + 110)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 160, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 2. Golden Marble
const template02 = {
  id: 'template-02',
  number: '02',
  name: 'Golden Marble',
  category: 'luxury',
  description: 'Rich dark marble aesthetic with fine diagonal gold veining',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    const p24 = formatINRNumber(data.gold24K);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0E17"/>
        <!-- Marble Veins -->
        <path d="M 0 100 Q 300 250 500 180 T 1080 320" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.15" fill="none"/>
        <path d="M 0 500 Q 400 420 700 650 T 1080 580" stroke="#D4AF37" stroke-width="1.2" stroke-opacity="0.12" fill="none"/>
        <path d="M 100 ${h} Q 400 ${h - 300} 800 ${h - 200} T ${w} ${h - 400}" stroke="#D4AF37" stroke-width="1.8" stroke-opacity="0.14" fill="none"/>

        <rect x="50" y="50" width="${w - 100}" height="${h - 100}" rx="24" fill="#0F172A" fill-opacity="0.75" stroke="url(#goldLinear)" stroke-width="1.5"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 210)}

        <g transform="translate(540, ${cY - 60})">
          <text x="0" y="-55" font-family="'Cinzel', serif" font-size="24" font-weight="700" letter-spacing="4" fill="#ECC874" text-anchor="middle">TODAY'S BENCHMARK</text>
          <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="70" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${p24}</text>
          <text x="0" y="42" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="3" fill="#D4AF37" text-anchor="middle">24 KARAT GOLD / GRAM</text>
        </g>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, 540, cY + 120)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 175, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 130, w)}
      </svg>
    `;
  }
};

// 3. Black & Gold
const template03 = {
  id: 'template-03',
  number: '03',
  name: 'Black & Gold',
  category: 'luxury',
  description: 'Striking matte charcoal with high-contrast metallic gold bars',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    const p24 = formatINRNumber(data.gold24K);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#09090B"/>
        <!-- Gold Diagonal Slashes -->
        <polygon points="0,0 200,0 0,200" fill="url(#goldLinear)" opacity="0.6"/>
        <polygon points="${w},${h} ${w - 200},${h} ${w},${h - 200}" fill="url(#goldLinear)" opacity="0.6"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 200)}

        <!-- Central High-Impact Gold Plaque -->
        <rect x="120" y="${cY - 150}" width="${w - 240}" height="240" rx="24" fill="#18181B" stroke="#27272A" stroke-width="2"/>
        <rect x="120" y="${cY - 150}" width="8" height="240" fill="url(#goldLinear)"/>

        <text x="160" y="${cY - 80}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="3" fill="#A1A1AA">24K 99.9% PURE BULLION</text>
        <text x="160" y="${cY - 5}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="64" font-weight="900" fill="#F4F4F5">₹${p24}<tspan font-size="24" fill="#A1A1AA">/g</tspan></text>
        <text x="160" y="${cY + 50}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="700" fill="#D4AF37">10g: ₹${formatINRNumber(data.gold10Grams24K)} • 1 Tola: ₹${formatINRNumber(data.goldTola24K)}</text>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, w - 240, cY - 110)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 140, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 4. Premium Bullion
const template04 = {
  id: 'template-04',
  number: '04',
  name: 'Premium Bullion',
  category: 'luxury',
  description: 'Simulated 999.9 gold bullion bar centerpiece with serial stamp styling',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    const p24 = formatINRNumber(data.gold24K);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0B0F19"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 190)}

        <!-- Gold Ingot Silhouette -->
        <g transform="translate(180, ${cY - 170})">
          <rect x="0" y="0" width="720" height="280" rx="16" fill="url(#goldLinear)" filter="url(#goldGlowFilter)"/>
          <rect x="8" y="8" width="704" height="264" rx="12" fill="#111827"/>
          
          <text x="360" y="55" font-family="'Cinzel', serif" font-size="18" font-weight="800" letter-spacing="6" fill="#D4AF37" text-anchor="middle">FINE GOLD 999.9</text>
          <text x="360" y="145" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="62" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${p24}<tspan font-size="24" fill="#94A3B8">/g</tspan></text>
          <text x="360" y="195" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="3" fill="#ECC874" text-anchor="middle">INTERNATIONAL SPOT EQUIVALENT</text>
          <line x1="200" y1="225" x2="520" y2="225" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1"/>
          <text x="360" y="248" font-family="monospace" font-size="12" fill="#64748B" text-anchor="middle">BAR ID: GLD-${data.timestamp ? String(data.timestamp).slice(-6) : '892011'}</text>
        </g>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, 540, cY + 160)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 215, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 110, w)}
      </svg>
    `;
  }
};

// 5. Heritage Gold
const template05 = {
  id: 'template-05',
  number: '05',
  name: 'Heritage Gold',
  category: 'luxury',
  description: 'Classic heritage styling with arched typography and royal seal',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0D14"/>
        <rect x="40" y="40" width="${w - 80}" height="${h - 80}" rx="30" fill="none" stroke="#D4AF37" stroke-width="2"/>
        
        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 200)}

        <circle cx="540" cy="${cY - 80}" r="140" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="8,8"/>
        <circle cx="540" cy="${cY - 80}" r="125" fill="#131B2E" stroke="#D4AF37" stroke-width="1"/>
        <text x="540" y="${cY - 120}" font-family="'Cinzel', serif" font-size="20" font-weight="700" letter-spacing="4" fill="#D4AF37" text-anchor="middle">24K PURE</text>
        <text x="540" y="${cY - 65}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
        <text x="540" y="${cY - 30}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="700" fill="#94A3B8" text-anchor="middle">PER GRAM</text>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, 540, cY + 110)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 170, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 6. Royal Palace
const template06 = {
  id: 'template-06',
  number: '06',
  name: 'Royal Palace',
  category: 'luxury',
  description: 'Palatial archway motif with radiating golden pillars',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#06090F"/>
        <!-- Archway -->
        <path d="M 200 ${h} L 200 ${cY} Q 540 ${cY - 260} 880 ${cY} L 880 ${h}" fill="none" stroke="url(#goldLinear)" stroke-width="2"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 190)}

        <text x="540" y="${cY - 50}" font-family="'Cinzel', serif" font-size="26" font-weight="700" letter-spacing="6" fill="#D4AF37" text-anchor="middle">ROYAL BULLION FIX</text>
        <text x="540" y="${cY + 20}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
        <text x="540" y="${cY + 60}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="#94A3B8" text-anchor="middle">24K RATE PER GRAM</text>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, 540, cY + 120)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 180, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 7. Luxury Minimal
const template07 = {
  id: 'template-07',
  number: '07',
  name: 'Luxury Minimal',
  category: 'luxury',
  description: 'Understated Swiss luxury with fine hairline grid lines',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0A0A0A"/>
        <line x1="100" y1="0" x2="100" y2="${h}" stroke="#27272A" stroke-width="1"/>
        <line x1="${w - 100}" y1="0" x2="${w - 100}" y2="${h}" stroke="#27272A" stroke-width="1"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 210)}

        <g transform="translate(140, ${cY - 60})">
          <text x="0" y="0" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="4" fill="#D4AF37">24 KARAT GOLD</text>
          <text x="0" y="70" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="76" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="115" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="600" fill="#71717A">Indicative Spot Reference / Gram</text>
        </g>

        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 160, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 8. Gold Foil
const template08 = {
  id: 'template-08',
  number: '08',
  name: 'Gold Foil',
  category: 'luxury',
  description: 'Shimmering metallic gold card effect with dual borders',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0D1117"/>
        <rect x="80" y="80" width="${w - 160}" height="${h - 160}" rx="20" fill="none" stroke="url(#goldLinear)" stroke-width="4"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 200)}

        <g transform="translate(540, ${cY})">
          <rect x="-350" y="-120" width="700" height="240" rx="20" fill="#161B22" stroke="#30363D" stroke-width="1.5"/>
          <text x="0" y="-55" font-family="'Cinzel', serif" font-size="22" font-weight="700" letter-spacing="4" fill="#D4AF37" text-anchor="middle">24K PURE GOLD SPOT</text>
          <text x="0" y="20" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="66" font-weight="900" fill="url(#goldShine)" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="65" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="700" fill="#8B949E" text-anchor="middle">PER GRAM • INR EQUIVALENT</text>
        </g>

        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 180, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 9. Black Velvet
const template09 = {
  id: 'template-09',
  number: '09',
  name: 'Black Velvet',
  category: 'luxury',
  description: 'Soft velvet radial dark aura with centered glowing typography',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#04060A"/>
        <circle cx="540" cy="${cY}" r="400" fill="url(#goldRadialGlow)" opacity="0.6"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 210)}

        <text x="540" y="${cY - 80}" font-family="'Cinzel', serif" font-size="28" font-weight="800" letter-spacing="8" fill="#D4AF37" text-anchor="middle">FINE GOLD 99.9%</text>
        <text x="540" y="${cY}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="74" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹${formatINRNumber(data.gold24K)}</text>
        <text x="540" y="${cY + 50}" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="3" fill="#94A3B8" text-anchor="middle">INR PER GRAM</text>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, 540, cY + 115)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 175, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

// 10. Executive Gold
const template10 = {
  id: 'template-10',
  number: '10',
  name: 'Executive Gold',
  category: 'luxury',
  description: 'Dual-column boardroom executive styling with gold accent pillar',
  render: (data, format = 'portrait') => {
    const { width: w, height: h, centerY: cY } = getDimensions(format);
    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        ${COMMON_DEFS}
        <rect width="${w}" height="${h}" fill="#0F141C"/>
        <rect x="0" y="0" width="16" height="${h}" fill="url(#goldLinear)"/>

        ${getHeaderBrand(data.brandName, data.brandWebsite)}
        ${getRateTypeNotice(data.rateType, 200)}

        <g transform="translate(140, ${cY - 120})">
          <rect x="0" y="0" width="${w - 280}" height="190" rx="16" fill="#182232" stroke="#23354E" stroke-width="1.5"/>
          <text x="40" y="50" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="16" font-weight="800" letter-spacing="3" fill="#D4AF37">24K PURE BENCHMARK</text>
          <text x="40" y="125" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="62" font-weight="900" fill="#FFFFFF">₹${formatINRNumber(data.gold24K)}<tspan font-size="22" fill="#94A3B8">/g</tspan></text>
          <text x="40" y="160" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="14" font-weight="600" fill="#94A3B8">10 Grams: ₹${formatINRNumber(data.gold10Grams24K)} • 1 Tola (11.6638g): ₹${formatINRNumber(data.goldTola24K)}</text>
        </g>

        ${getPriceChangeBadge(data.change24K, data.changePercent24K, data.isPositive, w - 240, cY + 115)}
        ${getSecondaryRatesBar(data.gold22K, data.gold18K, cY + 160, w)}
        ${getFooterMeta(data.date, data.time, data.source, h - 120, w)}
      </svg>
    `;
  }
};

module.exports = [
  template01, template02, template03, template04, template05,
  template06, template07, template08, template09, template10
];
