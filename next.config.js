/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
      };
    }
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;