import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {},
  transpilePackages: ['@fitsync/ui']
}

export default nextConfig
