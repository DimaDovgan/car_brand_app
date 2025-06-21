import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.auto-data.net'], // Додаємо дозволений домен
  },
   eslint: {
    ignoreDuringBuilds: true, // Тимчасово для деплою
  },
    outputFileTracingExcludes: {
      '**/*': [
        './cypress/**/*',
        './src/tests/**/*',
        './__mocks__/**/*',
        '**/*.test.*',
        '**/*.spec.*'
      ]
    },
  
  
};

export default nextConfig;
