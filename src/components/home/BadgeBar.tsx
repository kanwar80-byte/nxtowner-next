const icons = {
  shield: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  brain: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a3 3 0 00-3-3 3 3 0 00-3 3v10a3 3 0 003 3 3 3 0 013 3" />
      <path d="M12 4a3 3 0 013-3 3 3 0 013 3v10a3 3 0 01-3 3 3 3 0 00-3 3" />
      <path d="M9 7h3" />
      <path d="M9 12h3" />
      <path d="M15 7h-3" />
      <path d="M15 12h-3" />
    </svg>
  ),
  lock: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  scale: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h6l-3 7-3-7z" />
      <path d="M15 7h6l-3 7-3-7z" />
    </svg>
  ),
};

interface BadgeBarProps {
  mode: 'all' | 'operational' | 'digital';
}

export default function BadgeBar({ mode }: BadgeBarProps) {
  const badges = [
    { icon: icons.shield, label: 'Verified Listings' },
    { icon: icons.brain, label: 'AI Due Diligence' },
    { icon: icons.lock, label: 'Secure Deal Rooms' },
    { icon: icons.scale, label: 'Broker & Legal Support' },
  ];

  return (
    <section className="bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeInUp">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-6 sm:px-10 py-6 border border-gray-100">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-sm font-medium text-gray-800"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A122A] text-white text-lg shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                  {badge.icon}
                </span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
