// craco.config.js
const path = require("path");
require("dotenv").config();

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === "true",
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

const webpackConfig = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });

        // Disable watch mode
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }

      // Production optimizations
      if (process.env.NODE_ENV === 'production') {
        // Code splitting optimization
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Separate vendor bundle for react and react-dom
              reactVendor: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react-vendor',
                priority: 40,
                reuseExistingChunk: true,
              },
              // Separate bundle for UI libraries
              uiVendor: {
                test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|sonner)[\\/]/,
                name: 'ui-vendor',
                priority: 30,
                reuseExistingChunk: true,
              },
              // Separate bundle for charts
              chartsVendor: {
                test: /[\\/]node_modules[\\/](recharts)[\\/]/,
                name: 'charts-vendor',
                priority: 25,
                reuseExistingChunk: true,
              },
              // Common chunks
              common: {
                minChunks: 2,
                priority: 10,
                reuseExistingChunk: true,
                enforce: true,
              },
            },
          },
          // Minimize runtime chunk for better caching
          runtimeChunk: 'single',
        };

        // Minimize bundle size
        webpackConfig.performance = {
          maxAssetSize: 512000, // 500kb
          maxEntrypointSize: 512000,
          hints: 'warning',
        };
      }

      // Add bundle analyzer in production build
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        webpackConfig.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'bundle-report.html',
            openAnalyzer: false,
          })
        );
      }

      // Add health check plugin to webpack if enabled
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      return webpackConfig;
    },
  },
};

// Setup dev server with health check if enabled
if (config.enableHealthCheck) {
  webpackConfig.devServer = (devServerConfig) => {
    // Add health check endpoints if enabled
    if (setupHealthEndpoints && healthPluginInstance) {
      const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        // Call original setup if exists
        if (originalSetupMiddlewares) {
          middlewares = originalSetupMiddlewares(middlewares, devServer);
        }

        // Setup health endpoints
        setupHealthEndpoints(devServer, healthPluginInstance);

        return middlewares;
      };
    }

    return devServerConfig;
  };
}

module.exports = webpackConfig;
