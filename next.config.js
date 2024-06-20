/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['imagedelivery.net'], // Add the domain for your CDN
  },
};

module.exports = nextConfig;