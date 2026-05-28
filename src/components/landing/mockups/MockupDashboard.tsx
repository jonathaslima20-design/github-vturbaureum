interface DashboardStat {
  label: string;
  value: string;
  icon_name: string;
}

interface DashboardConfig {
  user_name?: string;
  period_label?: string;
  accent_color?: string;
  stats?: DashboardStat[];
}

export function MockupDashboard({ config }: { config: DashboardConfig }) {
  const accent = config.accent_color || '#0f172a';
  const stats = config.stats || [];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb]">
      {/* Header */}
      <div className="px-3 pt-4 pb-2 bg-white border-b border-gray-100 shrink-0">
        <p className="text-[10px] font-bold text-gray-900">Dashboard</p>
        <p className="text-[6.5px] text-gray-500 mt-0.5">
          Bem-vindo de volta, {config.user_name || 'Usuario'}!
        </p>
      </div>

      {/* Period Filter */}
      <div className="px-3 py-1.5 shrink-0">
        <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[3px] bg-white border border-gray-200">
          <span className="text-[6px] text-gray-600">{config.period_label || 'Ultimos 30 dias'}</span>
          <svg className="w-[6px] h-[6px] text-gray-400" viewBox="0 0 12 12" fill="none">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-1.5 px-3 shrink-0">
        {stats.slice(0, 4).map((stat, i) => (
          <div key={i} className="bg-white rounded-[5px] p-2 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[5.5px] font-medium text-gray-500">{stat.label}</span>
              <StatIcon name={stat.icon_name} color={accent} />
            </div>
            <p className="text-[11px] font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Mini Chart Area */}
      <div className="px-3 mt-2 flex-1 min-h-0">
        <div className="bg-white rounded-[5px] p-2 border border-gray-100 shadow-sm h-full max-h-[80px]">
          <p className="text-[6px] font-medium text-gray-500 mb-1">Visualizacoes</p>
          <svg className="w-full h-[40px]" viewBox="0 0 200 50" fill="none" preserveAspectRatio="none">
            <path
              d="M0 45 C30 40, 50 30, 70 35 C90 40, 100 20, 130 15 C160 10, 170 25, 200 5"
              stroke={accent}
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M0 45 C30 40, 50 30, 70 35 C90 40, 100 20, 130 15 C160 10, 170 25, 200 5 L200 50 L0 50 Z"
              fill={accent}
              opacity="0.08"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StatIcon({ name, color }: { name: string; color: string }) {
  const size = 10;
  const commonProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'Package':
      return (
        <svg {...commonProps}>
          <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
        </svg>
      );
    case 'TrendingUp':
      return (
        <svg {...commonProps}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    case 'Users':
      return (
        <svg {...commonProps}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case 'DollarSign':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
