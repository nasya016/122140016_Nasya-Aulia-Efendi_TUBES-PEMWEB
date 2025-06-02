import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Optional: Jika kamu pakai image eksternal
  images: {
    domains: ['your-image-source.com'], // ganti sesuai kebutuhan
  },
}

export default nextConfig
