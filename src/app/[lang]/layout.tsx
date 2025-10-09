// src/app/[lang]/layout.tsx

import React from 'react';

// 1. 【核心修复】添加 generateStaticParams 函数
// 这个函数告诉 Next.js 需要为哪些语言生成静态页面。
// 它必须是一个同步函数，并且返回一个包含 params 对象的数组。
export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'zh' },
    { lang: 'de' },
    { lang: 'fr' }
  ];
}

// 2. 【保持不变】你的布局组件本身是正确的
// 我们只是在同一个文件中添加了上面的函数
export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'en' | 'zh' | 'de' | 'fr' };
}) {
  return (
    // 将 lang 参数设置到 <html> 标签上
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  );
}
