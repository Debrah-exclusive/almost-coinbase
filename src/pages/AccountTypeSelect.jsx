import { useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';

const Card = ({ title, desc, icon, onClick, selected }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-5 rounded-xl border transition-colors bg-[#121316] text-white
    ${selected ? 'border-[#2C6BFF] bg-[#101526]' : 'border-[#1f2126] hover:bg-[#1b1d22]'}`}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-[#1f2126] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[0.9375rem] font-semibold">{title}</p>
        <p className="text-[0.875rem] text-[#8A919E]">{desc}</p>
      </div>
    </div>
  </button>
);

const AccountTypeSelect = () => {
  const navigate = useNavigate();
  const go = (type) => navigate('/signup', { state: { accountType: type } });

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex flex-col">
      <div className="px-6 pt-5">
        <a href="/"><Logo height={28} className="brightness-0 invert" /></a>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[560px]">
          <h1 className="text-[2rem] font-bold text-white mb-6">
            What kind of account are you creating?
          </h1>
          <div className="flex flex-col gap-4">
            <Card
              title="Personal"
              desc="Trade crypto as an individual."
              onClick={() => go('personal')}
              selected
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5B616E">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              }
            />
            <Card
              title="Business"
              desc="Manage teams and portfolios, accept crypto payments, access APIs, and more."
              onClick={() => go('business')}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5B616E">
                  <circle cx="8" cy="10" r="3" />
                  <circle cx="16" cy="10" r="3" />
                  <path d="M3 20c0-3 2.5-5 5-5s5 2 5 5" />
                  <path d="M11 20c0-3 2.5-5 5-5s5 2 5 5" />
                </svg>
              }
            />
            <Card
              title="Developer"
              desc="Build onchain using developer tooling."
              onClick={() => go('developer')}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#5B616E">
                  <path d="M7 7l-4 5 4 5" />
                  <path d="M17 7l4 5-4 5" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelect;
