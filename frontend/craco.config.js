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

// Production build optimizations
const isProduction = process.env.NODE_ENV === "production";

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
      if (isProduction) {
        // Parallel compilation for faster builds
        webpackConfig.parallelism = 4;

        // Cache configuration for faster rebuilds
        webpackConfig.cache = {
          type: 'filesystem',
          buildDependencies: {
            config: [__filename],
          },
        };

        // Code splitting optimization
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          // Minimize with Terser optimizations
          minimize: true,
          minimizer: webpackConfig.optimization.minimizer?.map(minimizer => {
            if (minimizer.constructor.name === 'TerserPlugin') {
              return new (require('terser-webpack-plugin'))({
                parallel: true,
                terserOptions: {
                  parse: { ecma: 2020 },
                  compress: {
                    ecma: 5,
                    comparisons: false,
                    inline: 2,
                    drop_console: true,
                    drop_debugger: true,
                  },
                  output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true,
                  },
                },
              });
            }
            return minimizer;
          }),
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
            cacheGroups: {
              // Separate vendor bundle for react and react-dom
              reactVendor: {
                test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
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
                test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
                name: 'charts-vendor',
                priority: 25,
                reuseExistingChunk: true,
              },
              // Utilities bundle
              utils: {
                test: /[\\/]node_modules[\\/](date-fns|axios|clsx|tailwind-merge|zod)[\\/]/,
                name: 'utils-vendor',
                priority: 20,
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
          // Module concatenation for smaller bundles
          concatenateModules: true,
        };

        // Disable bundle size warnings in production (they're handled by code splitting)
        webpackConfig.performance = {
          maxAssetSize: 1024000, // 1MB
          maxEntrypointSize: 1024000,
          hints: false, // Disable hints to prevent CI failures
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
