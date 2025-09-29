import { getDictionary } from '../../../dictionaries';
import EmailClientComponent from './EmailClientComponent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

// 定义 Props 类型
type Props = {
  params: { lang: 'en' | 'zh' | 'de' | 'fr' };
};

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

  // 定义一个可重用的 FAQ 项目组件，使代码更整洁
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

      {/* 使用 <main> 标签包裹主要内容，这是重要的 SEO 元素 */}
      <main className="main-content-area">
        
        {/* 核心应用区 */}
        <section aria-labelledby="core-app-heading">
          
          {/* 新增的页面主标题区域 */}
          <div className="page-headline-area">
            <h1 id="core-app-heading">{dict.mainHeading}</h1>
            <p className="tagline">{dict.tagline}</p>
          </div>

          {/* 客户端组件现在被包裹在自己的容器里 */}
          <EmailClientComponent dict={dict} />
        </section>

        {/* 静态内容区 */}
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
