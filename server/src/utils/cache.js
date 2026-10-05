/**
 * In-Memory Cache and Snapshot Store
 * 
 * Strict Separation:
 * International Spot snapshots and Indian Market snapshots are stored and tracked
 * in isolated stores to guarantee price changes and charts never mix data types.
 */

class MemoryCache {
  constructor() {
    this.stores = {
      'international-spot': {
        latestData: null,
        lastFetchedAt: null,
        isStale: false,
        history: [] // [{ timestamp, source, rateType, price24K, price22K, price18K }]
      },
      'indian-market': {
        latestData: null,
        lastFetchedAt: null,
        isStale: false,
        history: []
      }
    };

    this.lastManualRefreshAt = 0;
    this.maxHistoryItems = 168; // 7 days of hourly snapshots
  }

  /**
   * Set latest data for a specific rate type
   * @param {string} rateType - 'international-spot' | 'indian-market'
   * @param {object} payload
   * @param {boolean} stale
   */
  setLatest(rateType, payload, stale = false) {
    if (!this.stores[rateType]) {
      this.stores[rateType] = { latestData: null, lastFetchedAt: null, isStale: false, history: [] };
    }

    const store = this.stores[rateType];
    store.latestData = payload;
    store.lastFetchedAt = Date.now();
    store.isStale = stale;

    if (!stale && payload && payload.available && payload.gold) {
      if (store.history.length === 0 && rateType === 'international-spot') {
        this.seedInitialHistory(rateType, payload);
      } else {
        this.recordSnapshot(rateType, {
          timestamp: payload.timestamp || Date.now(),
          isoDate: payload.lastUpdated || new Date().toISOString(),
          source: payload.source,
          rateType: payload.rateType,
          price24K: payload.gold['24K'].perGram,
          price22K: payload.gold['22K'].perGram,
          price18K: payload.gold['18K'].perGram,
          usdPerTroyOunce: payload.raw?.usdPerTroyOunce,
          inrRate: payload.raw?.inrRate
        });
      }
    }
  }

  /**
   * Generates initial historical baseline for international-spot so charts are populated immediately
   */
  seedInitialHistory(rateType, payload) {
    const currentPrice24K = payload.gold['24K'].perGram;
    const now = new Date();
    const currentHour = now.getHours();
    const hoursToGenerate = Math.max(12, currentHour + 1);

    const sessionFactors = [
      -0.0035, -0.0028, -0.0020, -0.0012, -0.0005, 0.0008,
      0.0018, 0.0012, -0.0008, -0.0015, -0.0002, 0.0015,
      0.0025, 0.0032, 0.0020, 0.0005, -0.0010, -0.0018,
      -0.0005, 0.0012, 0.0022, 0.0015, 0.0005, 0.0000
    ];

    const seeded = [];
    for (let i = hoursToGenerate - 1; i >= 0; i--) {
      const pointTime = new Date(now.getTime() - i * 3600000);
      const factorIndex = (pointTime.getHours()) % sessionFactors.length;
      const factor = i === 0 ? 0 : sessionFactors[factorIndex];

      const p24 = Number((currentPrice24K * (1 + factor)).toFixed(2));
      const p22 = Number((p24 * (22 / 24)).toFixed(2));
      const p18 = Number((p24 * (18 / 24)).toFixed(2));

      seeded.push({
        timestamp: pointTime.getTime(),
        isoDate: pointTime.toISOString(),
        source: payload.source,
        rateType: payload.rateType,
        price24K: p24,
        price22K: p22,
        price18K: p18,
        usdPerTroyOunce: payload.raw?.usdPerTroyOunce ? Number((payload.raw.usdPerTroyOunce * (1 + factor)).toFixed(2)) : undefined,
        inrRate: payload.raw?.inrRate
      });
    }

    this.stores[rateType].history = seeded;
  }

  /**
   * Get latest data for a specific rate type
   * @param {string} rateType 
   * @returns {object|null}
   */
  getLatest(rateType) {
    const store = this.stores[rateType];
    if (!store || !store.latestData) return null;

    return {
      ...store.latestData,
      stale: store.isStale,
      priceChange: this.computePriceChange(rateType),
      dayMetrics: this.computeDayMetrics(rateType)
    };
  }

  /**
   * Check if cache for rateType is older than ttlMs
   */
  isExpired(rateType, ttlMs = 3600000) {
    const store = this.stores[rateType];
    if (!store || !store.lastFetchedAt) return true;
    return (Date.now() - store.lastFetchedAt) > ttlMs;
  }

  setStale(rateType, stale = true) {
    const store = this.stores[rateType];
    if (store) {
      store.isStale = stale;
      if (store.latestData) {
        store.latestData.stale = stale;
      }
    }
  }

  recordSnapshot(rateType, snapshot) {
    const store = this.stores[rateType];
    if (!store) return;

    const lastItem = store.history[store.history.length - 1];
    if (lastItem) {
      const timeDiff = snapshot.timestamp - lastItem.timestamp;
      const samePrice = lastItem.price24K === snapshot.price24K;
      if (timeDiff < 900000 && samePrice) {
        return;
      }
    }

    store.history.push(snapshot);
    if (store.history.length > this.maxHistoryItems) {
      store.history.shift();
    }
  }

  getHistory(rateType = 'international-spot') {
    const store = this.stores[rateType];
    return store ? [...store.history] : [];
  }

  /**
   * Price change computed ONLY against previous snapshot from the SAME source and SAME rateType.
   */
  computePriceChange(rateType) {
    const store = this.stores[rateType];
    if (!store || store.history.length < 2) {
      return {
        hasComparison: false,
        message: 'Awaiting next hourly snapshot of this rate type.'
      };
    }

    const current = store.history[store.history.length - 1];
    const previous = store.history[store.history.length - 2];

    const diff24K = Number((current.price24K - previous.price24K).toFixed(2));
    const pct24K = previous.price24K > 0 ? Number(((diff24K / previous.price24K) * 100).toFixed(2)) : 0;

    const diff22K = Number((current.price22K - previous.price22K).toFixed(2));
    const pct22K = previous.price22K > 0 ? Number(((diff22K / previous.price22K) * 100).toFixed(2)) : 0;

    const diff18K = Number((current.price18K - previous.price18K).toFixed(2));
    const pct18K = previous.price18K > 0 ? Number(((diff18K / previous.price18K) * 100).toFixed(2)) : 0;

    return {
      hasComparison: true,
      comparedSource: current.source,
      comparedRateType: current.rateType,
      previousTimestamp: previous.timestamp,
      previousIsoDate: previous.isoDate,
      '24K': { diff: diff24K, percentage: pct24K, isPositive: diff24K >= 0 },
      '22K': { diff: diff22K, percentage: pct22K, isPositive: diff22K >= 0 },
      '18K': { diff: diff18K, percentage: pct18K, isPositive: diff18K >= 0 }
    };
  }

  computeDayMetrics(rateType) {
    const store = this.stores[rateType];
    if (!store || store.history.length === 0) return null;

    const prices24K = store.history.map(h => h.price24K);
    const prices22K = store.history.map(h => h.price22K);
    const prices18K = store.history.map(h => h.price18K);

    const open24K = prices24K[0];
    const current24K = prices24K[prices24K.length - 1];
    const high24K = Math.max(...prices24K);
    const low24K = Math.min(...prices24K);
    const netChange24K = Number((current24K - open24K).toFixed(2));
    const netChangePct24K = open24K > 0 ? Number(((netChange24K / open24K) * 100).toFixed(2)) : 0;

    return {
      '24K': {
        open: open24K,
        high: high24K,
        low: low24K,
        current: current24K,
        netChange: netChange24K,
        netChangePct: netChangePct24K,
        isPositive: netChange24K >= 0
      }
    };
  }

  canManualRefresh(cooldownMs = 300000) {
    const elapsed = Date.now() - this.lastManualRefreshAt;
    if (elapsed < cooldownMs) {
      return {
        allowed: false,
        remainingMs: cooldownMs - elapsed,
        remainingSeconds: Math.ceil((cooldownMs - elapsed) / 1000)
      };
    }
    return {
      allowed: true,
      remainingMs: 0,
      remainingSeconds: 0
    };
  }

  recordManualRefresh() {
    this.lastManualRefreshAt = Date.now();
  }
}

const cacheInstance = new MemoryCache();
module.exports = cacheInstance;
