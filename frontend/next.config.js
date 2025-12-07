/** @type {import('next').NextConfig} */
const nextConfig = {
  // No basePath needed since we're handling routing in vercel.json
  // Enable React Strict Mode
  reactStrictMode: true,
  // Configure images if needed
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Remove standalone output for Vercel (it's for Docker deployments)
  // output: 'standalone',
  // Handle environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
};

module.exports = nextConfig;
