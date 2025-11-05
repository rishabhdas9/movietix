import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  transpilePackages: ['@movietix/database'],
}

export default nextConfig


