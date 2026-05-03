import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  // Format join date
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-[560px]">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {/* Avatar circle */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0052FF 0%, #00A3FF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0A0B0D',
                  lineHeight: 1.2,
                }}
              >
                {user?.name}
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#5B616E', marginTop: 2 }}>
                Member since {joined}
              </p>
            </div>
          </div>

          {/* Info card */}
          <div
            style={{
              background: '#F8F9FA',
              border: '1px solid #E8EAED',
              borderRadius: 16,
              padding: '24px',
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                margin: '0 0 16px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#5B616E',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Account Information
            </h2>

            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email Address', value: user?.email },
              { label: 'Account ID', value: user?.id || user?._id },
              { label: 'Member Since', value: joined },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #E8EAED',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#5B616E', fontWeight: 500 }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    color: '#0A0B0D',
                    fontWeight: 500,
                    textAlign: 'right',
                    maxWidth: '60%',
                    wordBreak: 'break-all',
                  }}
                >
                  {row.value || '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => navigate('/explore')}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 9999,
                background: '#0052FF',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Explore Crypto
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 9999,
                background: '#F8F9FA',
                border: '1px solid #E8EAED',
                color: '#0A0B0D',
                fontWeight: 600,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#E8EAED')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F8F9FA')}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
