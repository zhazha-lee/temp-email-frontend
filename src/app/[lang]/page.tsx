import { getDictionary } from '@/lib/dictionaries';
// import EmailClientComponent from './EmailClientComponent'; // 暂时注释掉 EmailClientComponent 的导入
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

// 1. 直接定义页面需要的 props 类型
type Props = {
  params: { lang: 'en' | 'zh' | 'de' | 'fr' };
  searchParams: { [key: string]: string | string[] | undefined };
};

// 2. 将 FaqItem 组件定义移到顶层 (如果之前没有做，现在做)
const FaqItem = ({ q, a }: { q: string; a: string }) => (
  <details className="faq-item">
    <summary>
      {q}
      <span className="icon">
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
      </span>
    </summary>
    <p>{a}</p>
  </details>
);

// 动态生成 Meta Tags (为了 SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: dict.pageTitle,
    description: dict.pageDescription,
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        'en': '/en',
        'zh': '/zh',
        'de': '/de',
        'fr': '/fr',
      },
    },
  };
}

// 页面主组件 (服务器组件)
export default async function HomePage({ params }: Props) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="page-wrapper">
      <Header dict={dict} currentLang={params.lang} />
      <main className="main-content-area">
        <section aria-labelledby="core-app-heading">
          <div className="page-headline-area">
            <h1 id="core-app-heading">{dict.mainHeading}</h1>
            <p className="tagline">{dict.tagline}</p>
          </div>
          {/* 【核心修复】暂时移除 EmailClientComponent 的渲染 */}
          {/* <EmailClientComponent dict={dict} /> */}
        </section>
        <div className="static-content-wrapper">
          <div className="static-content">
            <section aria-labelledby="what-is-heading">
              <h2 id="what-is-heading">{dict.whatIsTempMailTitle}</h2>
              <p>{dict.whatIsTempMailContent_p1}</p>
              <p>{dict.whatIsTempMailContent_p2}</p>
            </section>
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading">{dict.faqTitle}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FaqItem q={dict.faq1_q} a={dict.faq1_a} />
                <FaqItem q={dict.faq2_q} a={dict.faq2_a} />
                <FaqItem q={dict.faq3_q} a={dict.faq3_a} />
                <FaqItem q={dict.faq4_q} a={dict.faq4_a} />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
    </div>
  );
}
