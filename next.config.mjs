/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {},
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: /backend/,
    };
    return config;
  },
};

export default nextConfig;
