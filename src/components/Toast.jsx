import React, { useState, useEffect, useCallback } from 'react';
import './Toast.css';

/**
 * Toast notification component.
 * Usage: <Toast message="..." type="success|error|info" onDone={() => setToast(null)} />
 */
const Toast = ({ message, type = 'success', duration = 3000, onDone }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      if (onDone) onDone();
    }, 350);
  }, [onDone]);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    setExiting(false);
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, dismiss]);

  if (!visible || !message) return null;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className={`velora-toast velora-toast--${type} ${exiting ? 'velora-toast--exit' : 'velora-toast--enter'}`}>
      <span className="velora-toast__icon">{icons[type] || icons.info}</span>
      <span className="velora-toast__message">{message}</span>
      <button className="velora-toast__close" onClick={dismiss} aria-label="Close">×</button>
    </div>
  );
};

export default Toast;
