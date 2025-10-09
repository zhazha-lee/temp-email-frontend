// src/app/[lang]/layout.tsx

// 这个布局会接收 lang 参数
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
