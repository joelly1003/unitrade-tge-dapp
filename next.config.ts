import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push(
      'pino-pretty',
      'lokijs',
      'encoding',
      '@react-native-async-storage/async-storage',
      '@x402/core/client',
      '@x402/evm/exact/client',
      '@x402/evm/upto/client',
      '@x402/svm/exact/client',
      '@x402/evm',
      '@x402/svm'
    );
    return config;
  },
};

export default nextConfig;
