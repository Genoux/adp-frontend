/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['ddragon.leagueoflegends.com'], // Add the domain for your CDN
  },
};

module.exports = nextConfig;