/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: ['ddragon.leagueoflegends.com'], // Add the domain for your CDN
  },
};

module.exports = nextConfig;
