import React from 'react';

const WarningBanner = () => {
  return (
    <div
      role="alert"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        width: '100%',
        background: 'linear-gradient(90deg, #78350f 0%, #92400e 100%)',
        borderBottom: '1px solid #b45309',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 16px',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >

      <p
        style={{
          margin: 0,
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: '#fef3c7',
          textAlign: 'center',
          lineHeight: '1.5',
        }}
      >
        <strong style={{ color: '#fbbf24', fontWeight: 700 }}>⚠ Student Project</strong>
        {' — '}
        This is a demo app built for educational purposes only. It is{' '}
        <strong style={{ color: '#fbbf24' }}>not affiliated with any real crypto exchange</strong>.
        Do not enter real personal or financial information.
      </p>
    </div>
  );
};

export default WarningBanner;
