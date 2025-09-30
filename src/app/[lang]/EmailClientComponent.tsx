"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface Dictionary {
  yourTempAddress: string;
  errorCreateSession: string;
  copied: string;
  copy: string;
  refresh: string;
  newEmail: string;
  inbox: string;
  scanning: string;
  noSubject: string;
  waitingForEmails: string;
}

interface EmailListItem {
  id: string;
  from: { address: string; name: string; };
  subject: string;
  intro: string;
  createdAt: string;
}

interface EmailDetails {
  id: string;
  from: { address: string; name: string; };
  subject: string;
  text: string;
  html: string[];
  createdAt: string;
}

export default function EmailClientComponent({ dict }: { dict: Dictionary }) {
  const [emailAddress, setEmailAddress] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  const [emails, setEmails] = useState<EmailListItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createNewSession = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setEmails([]);
    try {
      const res = await fetch(`${apiBaseUrl}/api/session/new`);
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      setEmailAddress(data.address);
      setToken(data.token);
      setIsLoading(false);
    } catch (err) {
      console.error("Session creation failed:", err);
      setError(dict.errorCreateSession);
      setIsLoading(false);
    }
  }, [apiBaseUrl, dict.errorCreateSession]);

  const fetchEmails = useCallback(async (currentToken: string) => {
    if (!currentToken) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/emails`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
      }
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    }
  }, [apiBaseUrl]);

  const handleEmailClick = async (emailId: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/email/${emailId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedEmail(data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch email details:', err);
    }
  };

  useEffect(() => {
    createNewSession();
  }, [createNewSession]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (token) {
      fetchEmails(token); 
      intervalRef.current = setInterval(() => {
        fetchEmails(token);
      }, 7000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, fetchEmails]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      <div className="address-module">
        <p className="label">{dict.yourTempAddress}</p>
        <div className="address-display">
          {isLoading ? '...' : emailAddress || 'N/A'}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="actions-module">
          <button onClick={handleCopy} disabled={!emailAddress || isLoading} className="btn">
            {isCopied ? dict.copied : dict.copy}
          </button>
          <button onClick={() => fetchEmails(token)} disabled={!token || isLoading} className="btn">
            {dict.refresh}
          </button>
          <button onClick={createNewSession} disabled={isLoading} className="btn btn-primary">
            {dict.newEmail}
          </button>
        </div>
      </div>

      <div className="inbox-module">
        <div className="inbox-header">
          <h2>{dict.inbox}</h2>
          <div className="scanner">
            <div className="scanner-indicator"></div>
            <span>{dict.scanning}</span>
          </div>
        </div>
        {emails.length > 0 ? (
          <ul className="email-list">
            {emails.map((email) => (
              <li key={email.id} className="email-list-item" onClick={() => handleEmailClick(email.id)}>
                <p className="from">{email.from.name || email.from.address}</p>
                <p className="subject">{email.subject || `(${dict.noSubject})`}</p>
                <p className="date">{formatDate(email.createdAt)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-inbox">
            <p>{dict.waitingForEmails}</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedEmail && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEmail.subject || `(${dict.noSubject})`}</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="email-content" dangerouslySetInnerHTML={{ __html: selectedEmail.html ? selectedEmail.html.join('') : selectedEmail.text }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
