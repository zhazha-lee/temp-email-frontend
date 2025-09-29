import type { NextConfig } from "next";

const nextConfig = {
  // 在这里添加 i18n 配置
  i18n: {
    // 这是一个支持的语言环境列表
    locales: ['en', 'zh', 'de', 'fr'],
    
    // 这是当用户访问一个没有语言前缀的路径时使用的默认语言环境
    // 例如，访问 / 会被重定向到 /en
    defaultLocale: 'en',
  },
  // 注意：reactStrictMode: true 是默认开启的，无需显式添加
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
