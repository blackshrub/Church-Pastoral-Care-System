/**
 * Web Vitals Reporting
 * Tracks Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - INP (Interaction to Next Paint) - Responsiveness (replaces FID)
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - FCP (First Contentful Paint) - Initial render
 * - TTFB (Time to First Byte) - Server response
 */

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

/**
 * Send metrics to analytics endpoint
 * @param {Object} metric - Web Vitals metric object
 */
export const sendToAnalytics = (metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const { name, value, rating, delta, id } = metric;
    console.log(`[Web Vitals] ${name}: ${Math.round(value)} (${rating})`);
  }

  // In production, you can send to your analytics service
  // Example: Send to backend analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now()
    });

    // Use sendBeacon for reliable delivery even on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      // Fallback to fetch
      fetch('/api/analytics/vitals', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      });
    }
  }
};

export default reportWebVitals;
