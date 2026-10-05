const { escapeXml, formatINRNumber, getDimensions, COMMON_DEFS } = require('./primitives');

const socialTemplates = [
  // 41. Gold Alert - Urgent, high-contrast breaking news banner style
  {
    id: 'gold-social-41',
    name: 'Gold Alert',
    category: 'social',
    description: 'High-contrast breaking news alert banner with bold badge and live pulse.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const changeColor = isUp ? '#22c55e' : '#ef4444';
      const changeSymbol = isUp ? '▲' : '▼';
      const changeSign = isUp ? '+' : '';
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');
      const brand = escapeXml(data.brandName || 'GOLD INDIA');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <linearGradient id="bg41" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16"/>
            <stop offset="100%" stop-color="#020408"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg41)"/>
        
        <!-- Red/Amber Alert bar at top -->
        <rect x="0" y="0" width="${w}" height="14" fill="#f59e0b"/>
        
        <g transform="translate(${w * 0.08}, ${h * 0.08})">
          <!-- Alert badge -->
          <rect x="0" y="0" width="220" height="48" rx="24" fill="#ef4444" fill-opacity="0.2" stroke="#ef4444" stroke-width="2"/>
          <circle cx="26" cy="24" r="8" fill="#ef4444"/>
          <text x="46" y="31" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="18" letter-spacing="3">HOURLY ALERT</text>

          <text x="0" y="110" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="54" letter-spacing="2">${brand}</text>
          <text x="0" y="150" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22" letter-spacing="1">LIVE SPOT COMMODITY DESK</text>

          <!-- Main Alert Card -->
          <rect x="0" y="200" width="${w * 0.84}" height="${format === 'story' ? 520 : 420}" rx="32" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
          <rect x="40" y="240" width="180" height="36" rx="8" fill="#f59e0b" fill-opacity="0.15"/>
          <text x="56" y="265" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="800" font-size="18" letter-spacing="2">24K FINE GOLD</text>

          <text x="40" y="380" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="78" letter-spacing="-1">₹${formatINRNumber(data.gold24K)}</text>
          <text x="40" y="425" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="24">per gram (99.9% Purity)</text>

          <!-- Change pill -->
          <rect x="40" y="470" width="280" height="50" rx="14" fill="${changeColor}" fill-opacity="0.15" stroke="${changeColor}" stroke-width="1.5"/>
          <text x="60" y="503" fill="${changeColor}" font-family="'Inter', sans-serif" font-weight="800" font-size="22">${changeSymbol} ${changeSign}₹${formatINRNumber(data.change24K || 0)} (${changeSign}${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <!-- Secondary Purity Pills -->
        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.58 : (format === 'square' ? h * 0.68 : h * 0.62)})">
          <g transform="translate(0, 0)">
            <rect width="${w * 0.40}" height="130" rx="20" fill="#1e293b" fill-opacity="0.7" stroke="#334155" stroke-width="1.5"/>
            <text x="24" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="20">22K JEWELLERY</text>
            <text x="24" y="85" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="34">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
            <text x="24" y="112" fill="#eab308" font-family="'Inter', sans-serif" font-weight="600" font-size="15">916 Hallmarked</text>
          </g>
          <g transform="translate(${w * 0.44}, 0)">
            <rect width="${w * 0.40}" height="130" rx="20" fill="#1e293b" fill-opacity="0.7" stroke="#334155" stroke-width="1.5"/>
            <text x="24" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="20">18K STANDARD</text>
            <text x="24" y="85" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="34">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
            <text x="24" y="112" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="15">750 Hallmarked</text>
          </g>
        </g>

        <!-- Footer -->
        <g transform="translate(${w * 0.08}, ${h * 0.90})">
          <text x="0" y="0" fill="#cbd5e1" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#64748b" font-family="'Inter', sans-serif" font-size="18">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 42. Daily Gold - Modern gradient card layout with clean social bubbles
  {
    id: 'gold-social-42',
    name: 'Daily Gold',
    category: 'social',
    description: 'Clean modern gradient backdrop with floating glassmorphic pricing badges.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const changeColor = isUp ? '#10b981' : '#f43f5e';
      const changeSymbol = isUp ? '▲' : '▼';
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <linearGradient id="bg42" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg42)"/>
        <circle cx="${w * 0.85}" cy="${h * 0.15}" r="260" fill="#fbbf24" fill-opacity="0.08" filter="blur(60px)"/>
        
        <g transform="translate(${w * 0.08}, ${h * 0.08})">
          <text x="0" y="30" fill="#a5b4fc" font-family="'Inter', sans-serif" font-weight="800" font-size="20" letter-spacing="4">DAILY GOLD DIGEST</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="46">${escapeXml(data.brandName || 'Gold India')}</text>
          
          <!-- Hero Card -->
          <rect x="0" y="130" width="${w * 0.84}" height="${format === 'story' ? 480 : 380}" rx="28" fill="#1e293b" fill-opacity="0.8" stroke="#6366f1" stroke-width="2"/>
          <text x="40" y="190" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="800" font-size="22" letter-spacing="2">PURE GOLD · 24 KARAT</text>
          <text x="40" y="285" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="74">₹${formatINRNumber(data.gold24K)}</text>
          <text x="40" y="330" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22">per 1 gram (excl. local taxes/making)</text>
          
          <rect x="40" y="360" width="240" height="42" rx="10" fill="${changeColor}" fill-opacity="0.15"/>
          <text x="56" y="388" fill="${changeColor}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${changeSymbol} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <!-- Secondary grid -->
        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.55 : (format === 'square' ? h * 0.65 : h * 0.58)})">
          <g transform="translate(0, 0)">
            <rect width="${w * 0.40}" height="140" rx="20" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="24" y="44" fill="#a5b4fc" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K GOLD (91.6%)</text>
            <text x="24" y="94" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="34">₹${formatINRNumber(data.gold22K)}</text>
            <text x="24" y="122" fill="#64748b" font-family="'Inter', sans-serif" font-size="16">per gram</text>
          </g>
          <g transform="translate(${w * 0.44}, 0)">
            <rect width="${w * 0.40}" height="140" rx="20" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
            <text x="24" y="44" fill="#a5b4fc" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K GOLD (75.0%)</text>
            <text x="24" y="94" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="34">₹${formatINRNumber(data.gold18K)}</text>
            <text x="24" y="122" fill="#64748b" font-family="'Inter', sans-serif" font-size="16">per gram</text>
          </g>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#64748b" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 43. Price Update - Minimalist typography with neon glow badge
  {
    id: 'gold-social-43',
    name: 'Price Update',
    category: 'social',
    description: 'Crisp social snapshot with neon gradient badges and high-visibility rate stack.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#ec4899"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="#0b0f19"/>
        <line x1="0" y1="0" x2="${w}" y2="0" stroke="url(#neonGrad)" stroke-width="12"/>

        <g transform="translate(${w * 0.08}, ${h * 0.09})">
          <rect x="0" y="0" width="180" height="38" rx="19" fill="url(#neonGrad)"/>
          <text x="24" y="24" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="16" letter-spacing="2">NEW UPDATE</text>

          <text x="0" y="90" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="48">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
          <text x="0" y="126" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="20">Official Hourly Spot Snapshot</text>

          <g transform="translate(0, 170)">
            <rect width="${w * 0.84}" height="${format === 'story' ? 440 : 360}" rx="24" fill="#131b2e" stroke="#1e293b" stroke-width="2"/>
            <text x="40" y="60" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="800" font-size="24" letter-spacing="1">24 KARAT GOLD</text>
            <text x="40" y="150" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="76">₹${formatINRNumber(data.gold24K)}</text>
            <text x="40" y="195" fill="#64748b" font-family="'Inter', sans-serif" font-size="22">INR per Gram · 99.9% Pure</text>

            <rect x="40" y="235" width="220" height="42" rx="8" fill="${isUp ? '#10b981' : '#f43f5e'}" fill-opacity="0.2"/>
            <text x="56" y="263" fill="${isUp ? '#10b981' : '#f43f5e'}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>
        </g>

        <!-- Secondary Purity Cards -->
        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.58 : (format === 'square' ? h * 0.65 : h * 0.58)})">
          <rect width="${w * 0.40}" height="130" rx="18" fill="#131b2e" stroke="#1e293b" stroke-width="1.5"/>
          <text x="24" y="44" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="90" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="34">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="130" rx="18" fill="#131b2e" stroke="#1e293b" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="44" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.44 + 24}" y="90" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="34">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#64748b" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 44. Gold Today - Bold editorial typography with striking gold accent bar
  {
    id: 'gold-social-44',
    name: 'Gold Today',
    category: 'social',
    description: 'Editorial magazine header with bold typography and prominent gold price focus.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
        </defs>
        <rect width="${w}" height="${h}" fill="#111827"/>
        <rect x="0" y="0" width="${w * 0.02}" height="${h}" fill="#fbbf24"/>

        <g transform="translate(${w * 0.10}, ${h * 0.08})">
          <text x="0" y="40" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="900" font-size="64" letter-spacing="4">GOLD TODAY</text>
          <text x="0" y="80" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="600" font-size="22" letter-spacing="1">REAL-TIME COMMODITY REPORT</text>

          <g transform="translate(0, 150)">
            <text x="0" y="0" fill="#e5e7eb" font-family="'Inter', sans-serif" font-weight="800" font-size="26">24 KARAT GOLD</text>
            <text x="0" y="90" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="88" letter-spacing="-2">₹${formatINRNumber(data.gold24K)}</text>
            <text x="0" y="140" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="600" font-size="24">per gram (Fine 999.0)</text>
            <text x="0" y="180" fill="${isUp ? '#34d399' : '#f87171'}" font-family="'Inter', sans-serif" font-weight="800" font-size="22">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>

          <g transform="translate(0, ${format === 'story' ? 520 : (format === 'square' ? 440 : 420)})">
            <line x1="0" y1="0" x2="${w * 0.80}" y2="0" stroke="#374151" stroke-width="2"/>
            
            <g transform="translate(0, 50)">
              <text x="0" y="0" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="700" font-size="20">22 KARAT (916)</text>
              <text x="0" y="45" fill="#f3f4f6" font-family="'Inter', sans-serif" font-weight="800" font-size="36">₹${formatINRNumber(data.gold22K)}<tspan font-size="20" fill="#6b7280">/g</tspan></text>
            </g>

            <g transform="translate(${w * 0.40}, 50)">
              <text x="0" y="0" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="700" font-size="20">18 KARAT (750)</text>
              <text x="0" y="45" fill="#f3f4f6" font-family="'Inter', sans-serif" font-weight="800" font-size="36">₹${formatINRNumber(data.gold18K)}<tspan font-size="20" fill="#6b7280">/g</tspan></text>
            </g>
          </g>
        </g>

        <g transform="translate(${w * 0.10}, ${h * 0.88})">
          <text x="0" y="0" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="600" font-size="20">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="30" fill="#4b5563" font-family="'Inter', sans-serif" font-size="16">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 45. Gold Snapshot - Camera viewfinder / photo snapshot motif
  {
    id: 'gold-social-45',
    name: 'Gold Snapshot',
    category: 'social',
    description: 'Modern viewfinder camera frame motif with precise live rate indicators.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#090b10"/>

        <!-- Viewfinder Corners -->
        <g stroke="#eab308" stroke-width="4" fill="none">
          <path d="M 60 120 L 60 60 L 120 60"/>
          <path d="M ${w - 120} 60 L ${w - 60} 60 L ${w - 60} 120"/>
          <path d="M 60 ${h - 120} L 60 ${h - 60} L 120 ${h - 60}"/>
          <path d="M ${w - 120} ${h - 60} L ${w - 60} ${h - 60} L ${w - 60} ${h - 120}"/>
        </g>

        <!-- Viewfinder center crosshair -->
        <g stroke="#eab308" stroke-width="1.5" stroke-opacity="0.3">
          <line x1="${w * 0.48}" y1="${h * 0.45}" x2="${w * 0.52}" y2="${h * 0.45}"/>
          <line x1="${w * 0.50}" y1="${h * 0.45 - 20}" x2="${w * 0.50}" y2="${h * 0.45 + 20}"/>
        </g>

        <!-- REC icon -->
        <g transform="translate(100, 100)">
          <circle cx="10" cy="10" r="8" fill="#ef4444"/>
          <text x="28" y="16" fill="#ef4444" font-family="'Inter', sans-serif" font-weight="800" font-size="16" letter-spacing="2">SNAPSHOT</text>
        </g>

        <text x="${w * 0.5}" y="${h * 0.16}" text-anchor="middle" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="38" letter-spacing="4">${escapeXml(data.brandName || 'GOLD INDIA')}</text>

        <g transform="translate(${w * 0.5}, ${h * 0.38})" text-anchor="middle">
          <text x="0" y="0" fill="#eab308" font-family="'Inter', sans-serif" font-weight="800" font-size="24" letter-spacing="3">24K PURE GOLD</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="84" letter-spacing="-1">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="125" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22">per gram · 99.9% Fineness</text>
          <text x="0" y="170" fill="${isUp ? '#22c55e' : '#ef4444'}" font-family="'Inter', sans-serif" font-weight="800" font-size="22">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <!-- Grid boxes -->
        <g transform="translate(${w * 0.15}, ${format === 'story' ? h * 0.62 : (format === 'square' ? h * 0.68 : h * 0.64)})">
          <rect width="${w * 0.33}" height="100" rx="16" fill="#131b2e" stroke="#1e293b" stroke-width="1.5"/>
          <text x="20" y="36" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="16">22K JEWELLERY</text>
          <text x="20" y="74" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="28">₹${formatINRNumber(data.gold22K)}</text>

          <rect x="${w * 0.37}" y="0" width="${w * 0.33}" height="100" rx="16" fill="#131b2e" stroke="#1e293b" stroke-width="1.5"/>
          <text x="${w * 0.37 + 20}" y="36" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="16">18K STANDARD</text>
          <text x="${w * 0.37 + 20}" y="74" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="28">₹${formatINRNumber(data.gold18K)}</text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.88})" text-anchor="middle">
          <text x="0" y="0" fill="#e2e8f0" font-family="'Inter', sans-serif" font-weight="700" font-size="20">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="28" fill="#64748b" font-family="'Inter', sans-serif" font-size="16">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 46. Gold Minute - Dynamic speedometer/timer aesthetic
  {
    id: 'gold-social-46',
    name: 'Gold Minute',
    category: 'social',
    description: 'Fast-paced minute-by-minute rate tracker with glowing dials and ticker vibe.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#0f172a"/>
        <circle cx="${w * 0.5}" cy="${h * 0.42}" r="320" fill="#f59e0b" fill-opacity="0.04"/>
        <circle cx="${w * 0.5}" cy="${h * 0.42}" r="280" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="10 8"/>

        <g transform="translate(${w * 0.5}, ${h * 0.12})" text-anchor="middle">
          <text x="0" y="0" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="22" letter-spacing="4">HOURLY TICKER</text>
          <text x="0" y="42" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="44">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.38})" text-anchor="middle">
          <text x="0" y="0" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="24" letter-spacing="2">24 KARAT SPOT</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="82">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="125" fill="#64748b" font-family="'Inter', sans-serif" font-size="22">per gram</text>
          <text x="0" y="170" fill="${isUp ? '#10b981' : '#f43f5e'}" font-family="'Inter', sans-serif" font-weight="800" font-size="24">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <g transform="translate(${w * 0.10}, ${format === 'story' ? h * 0.65 : (format === 'square' ? h * 0.70 : h * 0.65)})">
          <rect width="${w * 0.38}" height="110" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <text x="24" y="38" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K GOLD</text>
          <text x="24" y="80" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>

          <rect x="${w * 0.42}" y="0" width="${w * 0.38}" height="110" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <text x="${w * 0.42 + 24}" y="38" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K GOLD</text>
          <text x="${w * 0.42 + 24}" y="80" fill="#f8fafc" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.90})" text-anchor="middle">
          <text x="0" y="0" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="20">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="28" fill="#475569" font-family="'Inter', sans-serif" font-size="16">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 47. Market Update - Two-tone diagonal contrast design
  {
    id: 'gold-social-47',
    name: 'Market Update',
    category: 'social',
    description: 'Dynamic diagonal color-split composition with bold high-contrast pricing.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#0b0f19"/>
        <!-- Diagonal polygon -->
        <polygon points="0,0 ${w},0 ${w},${h * 0.35} 0,${h * 0.20}" fill="#1e1b4b"/>

        <g transform="translate(${w * 0.08}, ${h * 0.08})">
          <text x="0" y="30" fill="#c7d2fe" font-family="'Inter', sans-serif" font-weight="900" font-size="20" letter-spacing="3">MARKET UPDATE</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="50">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.30})">
          <rect width="${w * 0.84}" height="${format === 'story' ? 440 : 360}" rx="24" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
          <text x="40" y="60" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="800" font-size="24" letter-spacing="2">24 KARAT GOLD RATE</text>
          <text x="40" y="150" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="76">₹${formatINRNumber(data.gold24K)}</text>
          <text x="40" y="195" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22">per gram (Fine 999)</text>

          <rect x="40" y="235" width="240" height="44" rx="10" fill="${isUp ? '#10b981' : '#f43f5e'}" fill-opacity="0.2"/>
          <text x="56" y="264" fill="${isUp ? '#10b981' : '#f43f5e'}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.68 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.40}" height="120" rx="16" fill="#131b2e" stroke="#1e293b" stroke-width="1.5"/>
          <text x="24" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K GOLD</text>
          <text x="24" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="120" rx="16" fill="#131b2e" stroke="#1e293b" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K GOLD</text>
          <text x="${w * 0.44 + 24}" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#cbd5e1" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#64748b" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 48. Gold Brief - Clean corporate newsletter card
  {
    id: 'gold-social-48',
    name: 'Gold Brief',
    category: 'social',
    description: 'Executive newsletter brief layout with bulleted gold pricing and source clarity.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#0d1117"/>
        <rect x="${w * 0.08}" y="${h * 0.06}" width="${w * 0.84}" height="${h * 0.88}" rx="24" fill="#161b22" stroke="#30363d" stroke-width="2"/>

        <g transform="translate(${w * 0.14}, ${h * 0.12})">
          <text x="0" y="24" fill="#58a6ff" font-family="'Inter', sans-serif" font-weight="800" font-size="20" letter-spacing="3">EXECUTIVE BRIEF</text>
          <text x="0" y="70" fill="#f0f6fc" font-family="'Inter', sans-serif" font-weight="900" font-size="44">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
          <text x="0" y="105" fill="#8b949e" font-family="'Inter', sans-serif" font-size="18">Hourly Verified Metal Report · ${escapeXml(data.time || '')}</text>

          <g transform="translate(0, 160)">
            <rect width="${w * 0.72}" height="${format === 'story' ? 240 : 190}" rx="16" fill="#0d1117" stroke="#238636" stroke-width="1.5"/>
            <text x="30" y="44" fill="#e3b341" font-family="'Inter', sans-serif" font-weight="800" font-size="20">24K PURE GOLD</text>
            <text x="30" y="115" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="60">₹${formatINRNumber(data.gold24K)}<tspan font-size="26" fill="#8b949e">/g</tspan></text>
            <text x="30" y="155" fill="${isUp ? '#3fb950' : '#f85149'}" font-family="'Inter', sans-serif" font-weight="700" font-size="18">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>

          <g transform="translate(0, ${format === 'story' ? 440 : (format === 'square' ? 390 : 380)})">
            <rect width="${w * 0.72}" height="90" rx="14" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
            <text x="30" y="52" fill="#8b949e" font-family="'Inter', sans-serif" font-weight="700" font-size="20">22K Jewellery Rate</text>
            <text x="${w * 0.72 - 30}" y="54" text-anchor="end" fill="#f0f6fc" font-family="'Inter', sans-serif" font-weight="800" font-size="30">₹${formatINRNumber(data.gold22K)}/g</text>
          </g>

          <g transform="translate(0, ${format === 'story' ? 550 : (format === 'square' ? 500 : 490)})">
            <rect width="${w * 0.72}" height="90" rx="14" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
            <text x="30" y="52" fill="#8b949e" font-family="'Inter', sans-serif" font-weight="700" font-size="20">18K Standard Rate</text>
            <text x="${w * 0.72 - 30}" y="54" text-anchor="end" fill="#f0f6fc" font-family="'Inter', sans-serif" font-weight="800" font-size="30">₹${formatINRNumber(data.gold18K)}/g</text>
          </g>

          <g transform="translate(0, ${format === 'story' ? 700 : (format === 'square' ? 620 : 610)})">
            <text x="0" y="0" fill="#8b949e" font-family="'Inter', sans-serif" font-size="16">Date: ${escapeXml(data.date || '')}</text>
            <text x="0" y="26" fill="#6e7681" font-family="'Inter', sans-serif" font-size="15">Source: ${sourceText}</text>
          </g>
        </g>
      </svg>`;
    }
  },

  // 49. Daily Rate - Big numerical focus with vibrant yellow/gold contrast
  {
    id: 'gold-social-49',
    name: 'Daily Rate',
    category: 'social',
    description: 'Ultra-bold number-centric social layout designed for rapid mobile skimming.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#facc15"/>
        <rect x="0" y="${h * 0.28}" width="${w}" height="${h * 0.72}" fill="#09090b"/>

        <g transform="translate(${w * 0.08}, ${h * 0.10})">
          <text x="0" y="40" fill="#09090b" font-family="'Inter', sans-serif" font-weight="900" font-size="52" letter-spacing="1">TODAY'S RATE</text>
          <text x="0" y="80" fill="#451a03" font-family="'Inter', sans-serif" font-weight="800" font-size="22">${escapeXml(data.brandName || 'GOLD INDIA')} · HOURLY SNAPSHOT</text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.38})">
          <text x="0" y="30" fill="#facc15" font-family="'Inter', sans-serif" font-weight="800" font-size="26" letter-spacing="2">24 KARAT GOLD</text>
          <text x="0" y="130" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="94" letter-spacing="-2">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="180" fill="#a1a1aa" font-family="'Inter', sans-serif" font-weight="600" font-size="24">per 1 gram · Fine Gold</text>
          <text x="0" y="226" fill="${isUp ? '#4ade80' : '#f87171'}" font-family="'Inter', sans-serif" font-weight="800" font-size="24">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.68 : (format === 'square' ? h * 0.70 : h * 0.65)})">
          <rect width="${w * 0.40}" height="120" rx="16" fill="#18181b" stroke="#27272a" stroke-width="1.5"/>
          <text x="24" y="38" fill="#a1a1aa" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="34">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#71717a">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="120" rx="16" fill="#18181b" stroke="#27272a" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="38" fill="#a1a1aa" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.44 + 24}" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="34">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#71717a">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#e4e4e7" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#71717a" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 50. Gold News Card - Modern newspaper / media headline card
  {
    id: 'gold-social-50',
    name: 'Gold News Card',
    category: 'social',
    description: 'Authoritative news publication card with timestamped commodity quotes.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#0f172a"/>

        <g transform="translate(${w * 0.08}, ${h * 0.08})">
          <rect x="0" y="0" width="${w * 0.84}" height="60" rx="12" fill="#1e293b"/>
          <text x="24" y="38" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="900" font-size="22" letter-spacing="3">FINANCIAL NEWS CARD</text>
          <text x="${w * 0.84 - 24}" y="38" text-anchor="end" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="18">${escapeXml(data.time || '')}</text>

          <text x="0" y="130" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="52">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
          <text x="0" y="172" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="22">Hourly Bullion &amp; Jewellery Metal Benchmark</text>

          <g transform="translate(0, 220)">
            <rect width="${w * 0.84}" height="${format === 'story' ? 440 : 360}" rx="24" fill="#1e293b" fill-opacity="0.6" stroke="#334155" stroke-width="2"/>
            <text x="40" y="60" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="800" font-size="24">24 KARAT GOLD (99.9%)</text>
            <text x="40" y="150" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="82">₹${formatINRNumber(data.gold24K)}</text>
            <text x="40" y="195" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22">INR per gram · Pure Bullion</text>

            <rect x="40" y="235" width="240" height="44" rx="10" fill="${isUp ? '#10b981' : '#ef4444'}" fill-opacity="0.2"/>
            <text x="56" y="264" fill="${isUp ? '#10b981' : '#ef4444'}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>
        </g>

        <!-- Secondary Purity -->
        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.68 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.40}" height="120" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <text x="24" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="120" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.44 + 24}" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#cbd5e1" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')}</text>
          <text x="0" y="32" fill="#64748b" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 51. Neon Bullion - Cyberpunk glowing gold theme
  {
    id: 'gold-social-51',
    name: 'Neon Bullion',
    category: 'social',
    description: 'Electric neon cyber accents with glowing golden bullion typography.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="${w}" height="${h}" fill="#05070e"/>

        <g transform="translate(${w * 0.08}, ${h * 0.09})">
          <text x="0" y="30" fill="#38bdf8" font-family="'Inter', sans-serif" font-weight="900" font-size="20" letter-spacing="4">NEON BULLION DESK</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="48">${escapeXml(data.brandName || 'GOLD INDIA')}</text>

          <g transform="translate(0, 160)">
            <rect width="${w * 0.84}" height="${format === 'story' ? 440 : 360}" rx="24" fill="#090d16" stroke="#fbbf24" stroke-width="2" filter="url(#neonGlow)"/>
            <text x="40" y="60" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="800" font-size="24">24K PURE GOLD</text>
            <text x="40" y="150" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="78">₹${formatINRNumber(data.gold24K)}</text>
            <text x="40" y="195" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22">per 1 gram (99.9% fine)</text>

            <rect x="40" y="235" width="240" height="44" rx="10" fill="${isUp ? '#10b981' : '#f43f5e'}" fill-opacity="0.2"/>
            <text x="56" y="264" fill="${isUp ? '#10b981' : '#f43f5e'}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>
        </g>

        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.68 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.40}" height="120" rx="16" fill="#090d16" stroke="#1e293b" stroke-width="1.5"/>
          <text x="24" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="120" rx="16" fill="#090d16" stroke="#1e293b" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="40" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.44 + 24}" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#cbd5e1" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#64748b" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 52. Sovereign Reserve - Deep navy gold seal crest aesthetic
  {
    id: 'gold-social-52',
    name: 'Sovereign Reserve',
    category: 'social',
    description: 'Prestige sovereign reserve emblem with rich navy and gold badge hierarchy.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>${COMMON_DEFS}</defs>
        <rect width="${w}" height="${h}" fill="#081020"/>
        
        <!-- Subtle concentric circles -->
        <circle cx="${w * 0.5}" cy="${h * 0.45}" r="380" fill="none" stroke="#d4af37" stroke-opacity="0.1" stroke-width="2"/>
        <circle cx="${w * 0.5}" cy="${h * 0.45}" r="280" fill="none" stroke="#d4af37" stroke-opacity="0.15" stroke-width="1.5"/>

        <g transform="translate(${w * 0.5}, ${h * 0.12})" text-anchor="middle">
          <text x="0" y="0" fill="#d4af37" font-family="'Playfair Display', serif" font-weight="700" font-size="24" letter-spacing="4">SOVEREIGN RESERVE</text>
          <text x="0" y="44" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="46">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.40})" text-anchor="middle">
          <text x="0" y="0" fill="#d4af37" font-family="'Inter', sans-serif" font-weight="700" font-size="22" letter-spacing="2">24 KARAT FINE BULLION</text>
          <text x="0" y="80" fill="url(#metallicGold)" font-family="'Inter', sans-serif" font-weight="900" font-size="82">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="125" fill="#94a3b8" font-family="'Inter', sans-serif" font-size="22">per gram (99.9% Pure)</text>
          <text x="0" y="170" fill="${isUp ? '#22c55e' : '#ef4444'}" font-family="'Inter', sans-serif" font-weight="800" font-size="22">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <g transform="translate(${w * 0.10}, ${format === 'story' ? h * 0.66 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.38}" height="110" rx="16" fill="#0d1b33" stroke="#d4af37" stroke-opacity="0.3" stroke-width="1.5"/>
          <text x="24" y="38" fill="#d4af37" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>

          <rect x="${w * 0.42}" y="0" width="${w * 0.38}" height="110" rx="16" fill="#0d1b33" stroke="#d4af37" stroke-opacity="0.3" stroke-width="1.5"/>
          <text x="${w * 0.42 + 24}" y="38" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.42 + 24}" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#64748b">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.88})" text-anchor="middle">
          <text x="0" y="0" fill="#cbd5e1" font-family="'Inter', sans-serif" font-weight="600" font-size="20">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="28" fill="#64748b" font-family="'Inter', sans-serif" font-size="16">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 53. Cyber Gold - Tech grid matrix motif
  {
    id: 'gold-social-53',
    name: 'Cyber Gold',
    category: 'social',
    description: 'High-tech matrix grid background with illuminated terminal rate figures.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <pattern id="grid53" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="${w}" height="${h}" fill="#030712"/>
        <rect width="${w}" height="${h}" fill="url(#grid53)"/>

        <g transform="translate(${w * 0.08}, ${h * 0.08})">
          <rect x="0" y="0" width="220" height="34" rx="6" fill="#1f2937" stroke="#374151" stroke-width="1"/>
          <text x="16" y="23" fill="#eab308" font-family="'Courier New', monospace" font-weight="700" font-size="16">STATUS: ONLINE / 24H</text>

          <text x="0" y="90" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="48">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
          <text x="0" y="130" fill="#9ca3af" font-family="'Inter', sans-serif" font-size="20">TERMINAL FEED · ${escapeXml(data.time || '')}</text>

          <g transform="translate(0, 180)">
            <rect width="${w * 0.84}" height="${format === 'story' ? 440 : 360}" rx="20" fill="#111827" fill-opacity="0.9" stroke="#eab308" stroke-width="2"/>
            <text x="40" y="60" fill="#eab308" font-family="'Inter', sans-serif" font-weight="800" font-size="24">24 KARAT SPOT</text>
            <text x="40" y="150" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="82">₹${formatINRNumber(data.gold24K)}</text>
            <text x="40" y="195" fill="#9ca3af" font-family="'Inter', sans-serif" font-size="22">INR per gram (99.9% Purity)</text>

            <rect x="40" y="235" width="240" height="44" rx="8" fill="${isUp ? '#065f46' : '#991b1b'}" fill-opacity="0.3"/>
            <text x="56" y="264" fill="${isUp ? '#34d399' : '#f87171'}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>
        </g>

        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.68 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.40}" height="120" rx="14" fill="#111827" stroke="#374151" stroke-width="1.5"/>
          <text x="24" y="40" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#6b7280">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="120" rx="14" fill="#111827" stroke="#374151" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="40" fill="#9ca3af" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.44 + 24}" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#6b7280">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#e5e7eb" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')}</text>
          <text x="0" y="32" fill="#6b7280" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 54. Royal Saffron - Warm sunrise saffron & golden hues
  {
    id: 'gold-social-54',
    name: 'Royal Saffron',
    category: 'social',
    description: 'Vibrant sunset saffron gradient with grand golden type for festive social shares.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="50%" stop-color="#1c1917"/>
            <stop offset="100%" stop-color="#0c0a09"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#saffronGrad)"/>

        <!-- Top saffron line -->
        <rect x="0" y="0" width="${w}" height="14" fill="#f97316"/>

        <g transform="translate(${w * 0.08}, ${h * 0.08})">
          <text x="0" y="30" fill="#fb923c" font-family="'Inter', sans-serif" font-weight="900" font-size="20" letter-spacing="4">SAFFRON COMMODITY DESK</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="50">${escapeXml(data.brandName || 'GOLD INDIA')}</text>

          <g transform="translate(0, 160)">
            <rect width="${w * 0.84}" height="${format === 'story' ? 440 : 360}" rx="24" fill="#1c1917" stroke="#f97316" stroke-width="2"/>
            <text x="40" y="60" fill="#fb923c" font-family="'Inter', sans-serif" font-weight="800" font-size="24">24 KARAT GOLD</text>
            <text x="40" y="150" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="82">₹${formatINRNumber(data.gold24K)}</text>
            <text x="40" y="195" fill="#a8a29e" font-family="'Inter', sans-serif" font-size="22">per 1 gram (Fine 999.0)</text>

            <rect x="40" y="235" width="240" height="44" rx="10" fill="${isUp ? '#22c55e' : '#ef4444'}" fill-opacity="0.2"/>
            <text x="56" y="264" fill="${isUp ? '#22c55e' : '#ef4444'}" font-family="'Inter', sans-serif" font-weight="800" font-size="20">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
          </g>
        </g>

        <g transform="translate(${w * 0.08}, ${format === 'story' ? h * 0.68 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.40}" height="120" rx="16" fill="#1c1917" stroke="#292524" stroke-width="1.5"/>
          <text x="24" y="40" fill="#a8a29e" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#78716c">/g</tspan></text>

          <rect x="${w * 0.44}" y="0" width="${w * 0.40}" height="120" rx="16" fill="#1c1917" stroke="#292524" stroke-width="1.5"/>
          <text x="${w * 0.44 + 24}" y="40" fill="#a8a29e" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.44 + 24}" y="84" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#78716c">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.08}, ${h * 0.88})">
          <text x="0" y="0" fill="#e7e5e4" font-family="'Inter', sans-serif" font-weight="700" font-size="22">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="32" fill="#78716c" font-family="'Inter', sans-serif" font-size="17">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  },

  // 55. Velvet Jewel - Luxurious plum velvet jewel showcase
  {
    id: 'gold-social-55',
    name: 'Velvet Jewel',
    category: 'social',
    description: 'Deep plum and violet velvet background with glittering jewel-cut typography.',
    supportedFormats: ['portrait', 'square', 'story'],
    render: (data, format = 'portrait') => {
      const { w, h } = getDimensions(format);
      const isUp = (data.change24K || 0) >= 0;
      const sourceText = escapeXml(data.sourceLabel || 'API MITRA MARKET RATE');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
        <defs>
          ${COMMON_DEFS}
          <linearGradient id="velvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2e1065"/>
            <stop offset="50%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#0f0728"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#velvetGrad)"/>
        
        <!-- Diamond jewel symbol -->
        <polygon points="${w * 0.5},${h * 0.08} ${w * 0.5 + 24},${h * 0.08 + 24} ${w * 0.5},${h * 0.08 + 48} ${w * 0.5 - 24},${h * 0.08 + 24}" fill="#f59e0b"/>

        <g transform="translate(${w * 0.5}, ${h * 0.16})" text-anchor="middle">
          <text x="0" y="0" fill="#c084fc" font-family="'Inter', sans-serif" font-weight="800" font-size="20" letter-spacing="4">JEWELLERY BENCHMARK</text>
          <text x="0" y="44" fill="#ffffff" font-family="'Playfair Display', serif" font-weight="900" font-size="46">${escapeXml(data.brandName || 'GOLD INDIA')}</text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.40})" text-anchor="middle">
          <text x="0" y="0" fill="#f59e0b" font-family="'Inter', sans-serif" font-weight="800" font-size="24" letter-spacing="2">24 KARAT GOLD</text>
          <text x="0" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="900" font-size="82">₹${formatINRNumber(data.gold24K)}</text>
          <text x="0" y="125" fill="#c4b5fd" font-family="'Inter', sans-serif" font-size="22">per gram · Pure 999 Fineness</text>
          <text x="0" y="170" fill="${isUp ? '#34d399' : '#f87171'}" font-family="'Inter', sans-serif" font-weight="800" font-size="22">${isUp ? '▲' : '▼'} ${isUp ? '+' : ''}₹${formatINRNumber(data.change24K || 0)} (${(data.changePercent24K || 0).toFixed(2)}%)</text>
        </g>

        <g transform="translate(${w * 0.10}, ${format === 'story' ? h * 0.66 : (format === 'square' ? h * 0.70 : h * 0.64)})">
          <rect width="${w * 0.38}" height="110" rx="16" fill="#1e1b4b" stroke="#6b21a8" stroke-width="1.5"/>
          <text x="24" y="38" fill="#d8b4fe" font-family="'Inter', sans-serif" font-weight="700" font-size="18">22K JEWELLERY</text>
          <text x="24" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold22K)}<tspan font-size="18" fill="#a855f7">/g</tspan></text>

          <rect x="${w * 0.42}" y="0" width="${w * 0.38}" height="110" rx="16" fill="#1e1b4b" stroke="#6b21a8" stroke-width="1.5"/>
          <text x="${w * 0.42 + 24}" y="38" fill="#c4b5fd" font-family="'Inter', sans-serif" font-weight="700" font-size="18">18K STANDARD</text>
          <text x="${w * 0.42 + 24}" y="80" fill="#ffffff" font-family="'Inter', sans-serif" font-weight="800" font-size="32">₹${formatINRNumber(data.gold18K)}<tspan font-size="18" fill="#a855f7">/g</tspan></text>
        </g>

        <g transform="translate(${w * 0.5}, ${h * 0.88})" text-anchor="middle">
          <text x="0" y="0" fill="#e9d5ff" font-family="'Inter', sans-serif" font-weight="600" font-size="20">${escapeXml(data.date || '')} · ${escapeXml(data.time || '')}</text>
          <text x="0" y="28" fill="#a855f7" font-family="'Inter', sans-serif" font-size="16">Source: ${sourceText}</text>
        </g>
      </svg>`;
    }
  }
];

module.exports = socialTemplates;

