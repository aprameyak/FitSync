/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static optimization where possible
  poweredByHeader: false,
  // Configure image domains if needed
  images: {
    domains: ['localhost'],
  }
};

module.exports = nextConfig;