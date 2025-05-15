/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  distDir: 'dist',
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  trailingSlash: true,
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  staticPageGenerationTimeout: 1000,
  webpack: (config) => {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));
    
    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (
          moduleLoader.loader?.includes('css-loader') &&
          !moduleLoader.loader?.includes('postcss-loader')
        ) {
          moduleLoader.options.importLoaders = 
            moduleLoader.options.importLoaders === 0 ? 1 : moduleLoader.options.importLoaders;
        }
      });
    });
    
    return config;
  },
  sassOptions: {
    includePaths: ['./styles'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  publicRuntimeConfig: {
    staticFolder: '/static',
  },
};

module.exports = nextConfig;
