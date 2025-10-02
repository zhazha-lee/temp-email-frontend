import type { NextConfig } from 'next';

// 只声明一次 nextConfig，并将所有配置都放在这一个对象里
const nextConfig: NextConfig = {
  i18n: {
    locales: ['en', 'zh', 'de', 'fr'],
    defaultLocale: 'en',
  },
  // 如果您未来有其他配置，也可以继续添加在这里
  // 例如: reactStrictMode: true,
};

export default nextConfig;
