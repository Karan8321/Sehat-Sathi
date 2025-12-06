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
  // Handle static exports if needed
  output: 'standalone',
  // Handle environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
};

module.exports = nextConfig;
