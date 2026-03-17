import React from 'react';

function Stars({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: '1.125rem', color: i <= count ? '#f59e0b' : '#e2e8f0' }}>
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ avatarUrl, author, size = 44 }) {
  const initials = (author || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={author}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: '#dbeafe', color: '#2563eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: `${size * 0.35}px`, flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

export default function Testimonial({
  quote = 'This product completely changed how we work. Highly recommended!',
  author = 'Jane Smith',
  role = 'CEO, Acme Corp',
  avatarUrl = '',
  rating = 5,
  accentColor = '#2563eb',
  backgroundColor = '#ffffff',
  style = {}
}) {
  const cardStyle = {
    backgroundColor,
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
    ...style
  };

  return (
    <div className="testimonial" style={cardStyle}>
      <div style={{
        fontSize: '3rem', lineHeight: 1, color: accentColor,
        opacity: 0.2, position: 'absolute', top: '16px', left: '24px',
        fontFamily: 'Georgia, serif'
      }}>
        "
      </div>
      {rating > 0 && <Stars count={Math.max(0, Math.min(5, rating))} />}
      <p style={{
        fontSize: '1rem', lineHeight: 1.7, color: '#374151',
        margin: '0 0 24px 0', fontStyle: 'italic', paddingTop: '8px',
      }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
        <Avatar avatarUrl={avatarUrl} author={author} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1e293b' }}>{author}</div>
          {role && <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>{role}</div>}
        </div>
      </div>
    </div>
  );
}
