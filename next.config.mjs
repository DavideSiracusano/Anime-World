/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: /backend/,
    };
    return config;
  },
};

export default nextConfig;
