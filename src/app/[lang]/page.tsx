import { getDictionary } from '@/lib/dictionaries';
import EmailClientComponent from './EmailClientComponent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

// 1. 【核心修正】导入 Next.js 的内置 PageProps 类型
import type { PageProps } from 'next';

// 2. 【核心修正】让我们的 Props 类型继承自 PageProps
type Props = PageProps<{ lang: 'en' | 'zh' | 'de' | 'fr' }>;

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

  return (
    <div className="page-wrapper">
      <Header dict={dict} currentLang={params.lang} />
      <main className="main-content-area">
        <section aria-labelledby="core-app-heading">
          <div className="page-headline-area">
            <h1 id="core-app-heading">{dict.mainHeading}</h1>
            <p className="tagline">{dict.tagline}</p>
          </div>
          <EmailClientComponent dict={dict} />
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
