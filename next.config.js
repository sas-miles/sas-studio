import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_URL // Automatically provided in Vercel
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow images from the same domain as your application
      {
        protocol: 'https',
        hostname: 'sas-studio.vercel.app',
      },
      // Allow images from your S3 storage
      {
        hostname: process.env.S3_ENDPOINT?.replace('https://', '').replace('http://', '') || '',
        protocol: 'https',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Dynamic hostname based on environment
      ...(NEXT_PUBLIC_SERVER_URL
        ? [NEXT_PUBLIC_SERVER_URL].map((item) => {
            const url = new URL(item)
            return {
              hostname: url.hostname,
              protocol: url.protocol.replace(':', ''),
            }
          })
        : []),
    ],
    minimumCacheTTL: 300,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  reactStrictMode: true,
  redirects,
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'sharp']
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  httpAgentOptions: {
    keepAlive: true,
  },
}

export default withPayload(nextConfig)
