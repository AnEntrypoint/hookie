import React, { useState } from 'react';

export default function ContactForm({
  formAction = '',
  submitButtonText = 'Send Message',
  successMessage = 'Thanks! We\'ll get back to you soon.',
  nameLabel = 'Name',
  emailLabel = 'Email',
  messageLabel = 'Message',
  showPhone = false,
  style = {}
}) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const inputStyle = {
    width: '100%', padding: '12px 16px', fontSize: '1rem',
    border: '2px solid #e2e8f0', borderRadius: '8px',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border-color 150ms',
  };

  const labelStyle = {
    display: 'block', marginBottom: '6px',
    fontSize: '0.875rem', fontWeight: 600, color: '#374151',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formAction) return;
    setStatus('loading');
    setError('');
    const data = new FormData(e.target);
    try {
      const res = await fetch(formAction, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (res.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', ...style }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✓</div>
        <p style={{ fontSize: '1.125rem', color: '#166534', fontWeight: 600 }}>{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '560px', ...style }}>
      {!formAction && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '0.875rem', color: '#92400e' }}>
          Set the Form Action URL in properties to enable form submission (e.g., Formspree endpoint).
        </div>
      )}
      <div>
        <label style={labelStyle}>{nameLabel}</label>
        <input name="name" type="text" required placeholder="Your name" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>{emailLabel}</label>
        <input name="email" type="email" required placeholder="you@example.com" style={inputStyle} />
      </div>
      {showPhone && (
        <div>
          <label style={labelStyle}>Phone</label>
          <input name="phone" type="tel" placeholder="+1 (555) 000-0000" style={inputStyle} />
        </div>
      )}
      <div>
        <label style={labelStyle}>{messageLabel}</label>
        <textarea name="message" required rows={5} placeholder="Your message..." style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
      <button type="submit" disabled={status === 'loading' || !formAction} style={{
        padding: '14px 32px', backgroundColor: '#2563eb', color: '#ffffff',
        border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
        cursor: formAction ? 'pointer' : 'not-allowed', opacity: formAction ? 1 : 0.5,
        transition: 'all 200ms ease',
      }}>
        {status === 'loading' ? 'Sending...' : submitButtonText}
      </button>
    </form>
  );
}
