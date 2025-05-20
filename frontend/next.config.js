/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true
  },
  // Enable static optimization where possible
  poweredByHeader: false,
  // Configure image domains if needed
  images: {
    domains: ['localhost'],
  },
  // Ensure proper handling of environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
};

module.exports = nextConfig;