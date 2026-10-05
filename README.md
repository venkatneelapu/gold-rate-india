# 🇮🇳 Gold Rate India

> **A full-stack web application tracking official Indian domestic benchmark gold prices (24K, 22K, 18K), powered by API Mitra's Commodities API with a built-in Jewelry Calculator, Weight Conversion Matrix, 7-Day Interactive Trend Charts, and an automated Social Media Post Studio featuring 55+ templates.**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![Webpack](https://img.shields.io/badge/Webpack-5.97-8DD6F9.svg)](https://webpack.js.org/)
[![Data Source](https://img.shields.io/badge/Data_Source-API_Mitra-amber.svg)](https://apimitra.in)

---

## 📖 Overview

**Gold Rate India** provides accurate, real-time Indian domestic gold rates across all standard purities (24K Pure Gold, 22K Hallmarked Jewellery Gold, and 18K Standard Gold). 

All gold prices are sourced directly and exclusively from **API Mitra's Commodities API** (`https://api.apimitra.in/commodities`).

The project is designed with a strict zero-fabrication data policy:
- Sourced at the **Indian National Benchmark** level (`city=India`) by default, with dynamic support for 16+ Indian cities.
- No reliance on foreign currency conversions (no XAU/USD, no USD/INR spot multiplier).
- Backend-mediated API architecture ensuring zero credential exposure on the client.
- Built-in snapshot history and graceful offline handling.

---

## ✨ Key Features

- **🏆 Live Indian Gold Rates**:
  - **24 Karat (999 purity)**: Investment grade pure gold.
  - **22 Karat (916 purity)**: Standard Indian hallmarked jewelry gold.
  - **18 Karat (750 purity)**: Everyday jewelry grade gold.
  - Display rates per gram, per 8g (Sovereign/Pavan), per 10 grams, and per Tola (11.66g).

- **📍 City-Wise & National Coverage**:
  - Defaults to **India (National Benchmark)**.
  - Interactive selection across 16+ major Indian markets including Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Hyderabad, Lucknow, and more.

- **🧮 Comprehensive Jewelry & GST Calculator**:
  - Live value calculator based on selected purity and custom weight (grams).
  - Configurable making charges (percentage or fixed INR per gram).
  - Indian Goods & Services Tax (GST 3%) calculation breakdown.

- **⚖️ Dynamic Weight Conversion Table**:
  - Instant price matrix across 1g, 8g (Pavan), 10g, 50g, and 100g denominations for 24K, 22K, and 18K.

- **📈 7-Day Interactive Trend Chart**:
  - Visual historical price movements with change indicators (+/- diff & percentage) using Recharts.

- **🎨 Automated Social Media Post Studio (55+ Templates)**:
  - Generate high-resolution, social-media-ready price cards dynamically loaded with current gold prices.
  - **55+ unique handcrafted designs** across Minimalist, Modern Luxury, Indian Heritage, and Financial Infographic themes.
  - Multi-aspect ratio support: **Portrait (4:5)** for Instagram/LinkedIn, **Square (1:1)**, and **Story (9:16)**.
  - One-click PNG generation and download powered by Node.js Canvas & Sharp.

- **🌓 Dark & Light Mode**:
  - Fully responsive, glassmorphic UI with seamless theme toggling and system preference detection.

---

## 🏛️ System Architecture

```text
       ┌──────────────────────────────────────────────┐
       │   API Mitra Commodities API                  │
       │   https://api.apimitra.in/commodities        │
       └──────────────────────┬───────────────────────┘
                              │ HTTPS (JSON)
                              ▼
       ┌──────────────────────────────────────────────┐
       │   Node.js / Express Backend (Port 5000)      │
       │   • Sourcing & Normalization                 │
       │   • 15-min Scheduled Cron Sync               │
       │   • City Snapshot Database (apimitra_db.json)│
       │   • Social Post Image Generator (Sharp)      │
       └──────────────────────┬───────────────────────┘
                              │ REST API (/api/gold)
                              ▼
       ┌──────────────────────────────────────────────┐
       │   React 18 Single Page Application (Port 3000)│
       │   • Benchmark Cards & Denomination Switcher  │
       │   • Live Calculator with GST Breakdown       │
       │   • Weight Matrix & 7-Day Trend Chart        │
       │   • Social Media Post Generator & Downloader │
       └──────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Make sure you have the following installed on your machine:

- **[Node.js](https://nodejs.org/)**: Version `18.0.0` or higher
- **[npm](https://www.npmjs.com/)**: Version `9.0.0` or higher
- **[Git](https://git-scm.com/)**

Verify your environment by running:
```bash
node -v
npm -v
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_REPOSITORY_URL>
cd gold_prices
```

### 2. Install Dependencies

Install all dependencies across the workspace (root, server, and client) with a single command:

```bash
npm run install:all
```

*Or install them individually if preferred:*
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

---

### 3. Configure Environment Variables

The backend uses a `.env` file located in the `server/` directory.

Copy the example configuration:

```bash
# On Windows PowerShell:
cp server/.env.example server/.env

# On Linux / macOS:
cp server/.env.example server/.env
```

Here is the default `server/.env` configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# API Mitra Commodities API Configuration
APIMITRA_API_URL=https://api.apimitra.in/commodities
APIMITRA_API_KEY=

# Default Region (India for National Benchmark)
DEFAULT_CITY=India

# Refresh & Cache Settings
GOLD_REFRESH_MINUTES=15
CACHE_TTL_MS=900000
REFRESH_COOLDOWN_MS=60000

# Client Origin for CORS
CLIENT_ORIGIN=http://localhost:3000

# Brand Details
BRAND_NAME=Gold Rate India
BRAND_WEBSITE=https://goldrateindia.com
```

> **Note on API Key:** The API Mitra commodities endpoint can be accessed directly. If you possess an API key from [apimitra.in](https://apimitra.in), you may optionally supply it in `APIMITRA_API_KEY`. If left empty, the application cleanly runs using public requests and cached snapshots with zero errors.

---

### 4. Run the Application

You can launch both the **Backend** and **Frontend** simultaneously with one command from the project root:

```bash
npm run dev
```

*Alternatively, you can run them in separate terminals:*

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# React dev server starts on http://localhost:3000
```

---

### 5. Open in Your Browser

Navigate to:
```text
http://localhost:3000
```

The frontend will load with:
- **Today's Gold Rate in India** (National Benchmark rates for 24K, 22K, 18K)
- Active `Source: API Mitra` badge
- Exact timestamp in `Last Updated: DD Month YYYY, HH:MM IST` format
- Calculator, Weight Table, 7-Day Chart, and 55+ Social Templates ready to use.

---

## 📡 API Reference

The Node.js server exposes clean REST endpoints:

| Endpoint | Method | Query Parameters | Description |
| :--- | :---: | :--- | :--- |
| `/api/gold` | `GET` | `city` *(optional, default: `India`)* | Returns current 24K, 22K, 18K gold rates, denominations, and price change. |
| `/api/gold/history` | `GET` | `city` *(optional, default: `India`)* | Returns 7-day chronological price snapshots for chart rendering. |
| `/api/gold/cities` | `GET` | None | Returns the list of available Indian markets and cities. |
| `/api/gold/refresh` | `POST` | None | Triggers an immediate refresh poll from API Mitra (rate-limited by cooldown). |
| `/api/social-posts/latest`| `GET` | None | Returns metadata of the latest generated social media price post. |
| `/api/social-posts/generate` | `POST` | `templateId`, `format`, `city` | Generates a new social post using a specific or random template. |
| `/api/social-posts/templates`| `GET` | None | Returns catalog of all 55+ social media templates with design metadata. |
| `/api/social-posts/history` | `GET` | None | Returns archive of all previously generated social media image cards. |
| `/api/social-posts/:id/image`| `GET` | None | Serves or downloads the high-res generated PNG image file. |

---

## 🛠️ Production Build

To build the client bundle for production:

```bash
npm run build
```

This compiles optimized, minified production assets into `client/dist`.

The Node.js backend (`server/src/server.js`) is configured to automatically serve the production frontend from `client/dist` when accessed directly on port `5000`:

```bash
npm start
```

Then visit `http://localhost:5000` to view the production deployment.

---

## 📁 Project Structure

```text
gold_prices/
├── package.json              # Monorepo root workspaces configuration
├── README.md                 # Project documentation
│
├── server/                   # Backend Node.js / Express Application
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies (Express, Sharp, Axios, Cron)
│   ├── generated/            # Dynamic persistence folder
│   │   ├── apimitra_db.json  # Snapshot cache and city price database
│   │   └── social/           # Generated social media image posts
│   └── src/
│       ├── server.js         # Main Express entry point & middleware
│       ├── routes/
│       │   ├── goldRoutes.js        # /api/gold endpoints
│       │   └── socialPostRoutes.js  # /api/social-posts endpoints
│       ├── services/
│       │   └── goldService.js       # API Mitra commodities client & rate normalizer
│       └── social/
│           ├── socialPostService.js # Image generator service
│           └── templates/           # 55+ handcrafted SVG/Canvas templates
│
└── client/                   # Frontend React 18 Application
    ├── package.json          # Frontend dependencies (React, Recharts, Lucide, Tailwind)
    ├── webpack.config.js     # Webpack 5 development and production configuration
    ├── tailwind.config.js    # Tailwind design system tokens
    ├── public/
    │   └── index.html        # HTML5 entry template
    └── src/
        ├── main.jsx          # React DOM root entry
        ├── App.jsx           # Core routing & navigation
        ├── index.css         # Custom animations, glassmorphism, & scrollbars
        ├── pages/
        │   ├── Dashboard.jsx       # Main dashboard layout
        │   └── SocialPostsPage.jsx # Dedicated social post studio page
        ├── services/
        │   ├── goldApi.js          # Client API client for gold endpoints
        │   └── socialApi.js        # Client API client for post generator
        └── components/
            ├── Header.jsx                # Top bar with live IST clock & theme toggle
            ├── GoldBenchmarkSection.jsx  # Main 24K, 22K, 18K cards & unit switcher
            ├── GoldCalculator.jsx        # Value calculator with GST breakdown
            ├── GoldTable.jsx             # Denomination price matrix
            ├── PriceChart.jsx            # 7-day trend chart
            ├── SocialPostPreviewCard.jsx # Interactive template card previewer
            └── Disclaimer.jsx            # Regulatory compliance note (API Mitra attribution)
```

---

## 🔒 Attribution & Compliance

- **Data Attribution**: Sourced via [API Mitra](https://apimitra.in) (`https://api.apimitra.in/commodities`).
- **No Third-Party Scraping**: Does not use unofficial scrapers or foreign spot conversions.
- **GST Notice**: Indian jewelry purchases are subject to 3% GST and applicable jeweler making charges. The built-in calculator keeps retail tax estimations transparent and separate from the pure benchmark price.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
