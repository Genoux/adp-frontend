/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: [
      'ddragon.leagueoflegends.com',
      'sunny-reprieve-production.up.railway.app',
    ],
  },
};

module.exports = nextConfig;
