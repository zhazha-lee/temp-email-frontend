"use client";

import { useState, useEffect, useCallback } from 'react';

// --- 1. 类型定义 ---
interface Session {
  address: string;
  token: string;
}

interface Email {
  id: string;
  from: {
    address: string;
    name: string;
  };
  subject: string;
  createdAt: string;
}

interface EmailDetails extends Email {
  text: string;
  html: string[];
}

// --- 2. 主组件 ---
export default function EmailClientComponent({ dict }: { dict: { [key: string]: string } }) {
  // --- 3. State 和 Hooks ---
  const [session, setSession] = useState<Session | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyButtonText, setCopyButtonText] = useState(dict.copy);
  const [isModalOpen, setIsModalOpen] = useState(false); // 新增 state 控制弹窗

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- 4. 核心功能函数 ---

  // 复制邮箱地址
  const handleCopy = () => {
    if (session) {
      navigator.clipboard.writeText(session.address);
      setCopyButtonText(dict.copied);
      setTimeout(() => setCopyButtonText(dict.copy), 2000);
    }
  };

  // 创建新会话 (获取新邮箱)
  const createNewSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSession(null);
    setEmails([]);
    setSelectedEmail(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/session/new`, { method: 'POST' });
      if (!response.ok) throw new Error(dict.error_create_session);
      const data: Session = await response.json();
      setSession(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, dict.error_create_session]);

  // 获取邮件列表
  const fetchEmails = useCallback(async (currentToken: string) => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/emails?token=${currentToken}`);
      if (!response.ok) {
        if (response.status === 401) {
          setError(dict.error_session_expired);
          setSession(null);
        }
        return;
      }
      const data: Email[] = await response.json();
      setEmails(data);
    } catch (err) {
      console.error("Fetch emails failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [API_BASE_URL, isRefreshing, dict.error_session_expired]);

  // 获取并设置选中的邮件详情，然后打开弹窗
  const fetchAndSetSelectedEmail = async (emailId: string) => {
    if (!session) return;
    setIsEmailLoading(true);
    setIsModalOpen(true); // 立即打开弹窗并显示加载状态
    setSelectedEmail(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/${emailId}?token=${session.token}`);
      if (!response.ok) throw new Error(dict.error_load_details);
      const data: EmailDetails = await response.json();
      setSelectedEmail(data);
    } catch (err: any) {
      // 在弹窗内显示错误，而不是全局
      console.error(err);
    } finally {
      setIsEmailLoading(false);
    }
  };

  // --- 5. useEffect Hooks ---

  // 组件加载时自动创建新会话
  useEffect(() => {
    createNewSession();
  }, [createNewSession]);

  // 每10秒轮询一次邮件列表
  useEffect(() => {
    if (!session?.token) return;
    const intervalId = setInterval(() => fetchEmails(session.token), 10000);
    return () => clearInterval(intervalId);
  }, [session, fetchEmails]);

  // --- 6. UI 渲染 ---
  return (
    <div className="app-container">
      {/* 模块一：地址显示和操作 */}
      <div className="address-module">
        <p className="label">{dict.yourAddress}</p>
        <div className="address-display">
          {isLoading ? '...' : session?.address}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="actions-module">
          <button onClick={handleCopy} disabled={!session || isLoading} className="btn btn-primary">{copyButtonText}</button>
          <button onClick={() => session && fetchEmails(session.token)} disabled={isRefreshing || !session} className="btn">{dict.refresh}</button>
          <button onClick={createNewSession} disabled={isLoading} className="btn">{dict.newEmail}</button>
        </div>
      </div>

      {/* 模块二：收件箱 */}
      <div className="inbox-module">
        <div className="inbox-header">
          <h2>{dict.inbox}</h2>
          <div className="scanner">
            <div className="scanner-indicator"></div>
            <span>{isRefreshing ? (dict.checking || 'Checking...') : (dict.scanning || 'Scanning...')}</span>
          </div>
        </div>
        <ul className="email-list">
          {emails.length > 0 ? (
            emails.map(email => (
              <li key={email.id} onClick={() => fetchAndSetSelectedEmail(email.id)} className="email-list-item">
                <p className="from">{email.from.name || email.from.address}</p>
                <p className="subject">{email.subject || `(${(dict.noSubject || 'No Subject')})`}</p>
                <p className="date">{new Date(email.createdAt).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <div className="empty-inbox">
              <p>{isLoading ? (dict.generating || 'Generating...') : (dict.inboxEmpty || 'Your inbox is empty')}</p>
            </div>
          )}
        </ul>
      </div>

      {/* 模块三：邮件详情弹窗 (Modal) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEmail?.subject || (dict.loadingEmail || 'Loading Email...')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>
            <div className="modal-body">
              {isEmailLoading ? (
                <p>{dict.loadingEmail || 'Loading Email...'}...</p>
              ) : selectedEmail ? (
                <div>
                  <p><strong>{dict.from}:</strong> {selectedEmail.from.name} &lt;{selectedEmail.from.address}&gt;</p>
                  <hr style={{borderColor: 'var(--dark-border)', margin: '1rem 0'}} />
                  <div className="email-content" dangerouslySetInnerHTML={{ __html: selectedEmail.html.join('') || selectedEmail.text.replace(/\n/g, '') }} />
                </div>
              ) : (
                <p>{dict.error_load_details || 'Failed to load email details.'}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
