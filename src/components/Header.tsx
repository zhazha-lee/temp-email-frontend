"use client"; // 声明为客户端组件以使用 state

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';

// 定义 Props 类型
type HeaderProps = {
  dict: { [key: string]: string };
  currentLang: 'en' | 'zh' | 'de' | 'fr';
};

export default function Header({ dict, currentLang }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ];

  const currentLanguageName = languages.find(lang => lang.code === currentLang)?.name || 'Language';

  // 点击外部区域关闭下拉菜单的逻辑
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    // 使用 <nav> 标签，增强 SEO 语义
    <nav className="app-header">
      <div className="header-container">
        {/* Logo */}
        <Link href={`/${currentLang}`} className="logo">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M85 35.134C85 32.2961 82.7039 30 79.866 30H20.134C17.2961 30 15 32.2961 15 35.134V64.866C15 67.7039 17.2961 70 20.134 70H79.866C82.7039 70 85 67.7039 85 64.866V35.134Z" stroke="var(--text-main )" stroke-width="8" stroke-linejoin="round"/>
            <path d="M15 30L46.2921 54.6677C48.4173 56.343 51.5827 56.343 53.7079 54.6677L85 30" stroke="var(--primary-color)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M79.866 30C82.7039 30 85 32.2961 85 35.134V39.134C85 41.9719 82.7039 44.268 79.866 44.268H65C62.2386 44.268 60 42.0294 60 39.268V30H79.866Z" fill="var(--primary-color)"/>
          </svg>
          {/* Logo 中的文字已降级为 span */}
          <span className="logo-text">{dict.logoText || "Tempt-Mail"}</span>
        </Link>

        {/* 下拉式语言切换器 */}
        <div className="language-switcher-container" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="language-dropdown-button">
            <span>{currentLanguageName}</span>
            <svg className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
          </button>

          {isDropdownOpen && (
            <div className="language-dropdown-menu">
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}`}
                  className={`dropdown-item ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => setIsDropdownOpen(false)} // 点击后关闭菜单
                >
                  {lang.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
