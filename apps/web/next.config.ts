import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fitsync/ui', '@fitsync/db'],
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default nextConfig
