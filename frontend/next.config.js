/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  // output: 'export', // Removed to fix i18n compatibility
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '',
  assetPrefix: '/',
  i18n
};

module.exports = nextConfig;
