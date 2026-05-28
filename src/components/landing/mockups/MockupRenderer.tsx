import { useRef, useState, useEffect } from 'react';
import { MockupStorefront } from './MockupStorefront';
import { MockupProductDetail } from './MockupProductDetail';
import { MockupDashboard } from './MockupDashboard';
import { MockupMyProducts } from './MockupMyProducts';
import { MockupCustom } from './MockupCustom';
import { getMaxScrollForScreenType } from './mockupScrollUtils';

export const REAL_WIDTH = 393;
export const REAL_HEIGHT = 852;
export const STATUS_BAR_HEIGHT = 54;
export const BROWSER_BAR_HEIGHT = 40;
export const CHROME_HEIGHT = STATUS_BAR_HEIGHT + BROWSER_BAR_HEIGHT;
export const CONTENT_HEIGHT = REAL_HEIGHT - CHROME_HEIGHT;

interface MockupRendererProps {
  screenType: string;
  config: Record<string, any>;
  scrollY?: number;
}

export function MockupRenderer({ screenType, config, scrollY = 0 }: MockupRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setScale(width / REAL_WIDTH);
        }
      }
    });

    observer.observe(el);
    const width = el.clientWidth;
    if (width > 0) setScale(width / REAL_WIDTH);

    return () => observer.disconnect();
  }, []);

  const maxScroll = getMaxScrollForScreenType(screenType, config);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: REAL_WIDTH,
          height: REAL_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <StatusBar />
        <BrowserBar screenType={screenType} config={config} />

        <div
          className="absolute left-0 right-0 bottom-0 overflow-hidden"
          style={{ top: CHROME_HEIGHT }}
        >
          <div
            style={{
              transform: `translateY(-${scrollY}px)`,
              transition: 'transform 150ms ease-out',
            }}
          >
            <ScreenContent screenType={screenType} config={config} />
          </div>

          {maxScroll > 0 && (
            <MockupScrollIndicator scrollY={scrollY} maxScroll={maxScroll} />
          )}
        </div>
      </div>
    </div>
  );
}

function MockupScrollIndicator({ scrollY, maxScroll }: { scrollY: number; maxScroll: number }) {
  const trackHeight = CONTENT_HEIGHT - 16;
  const totalContentHeight = CONTENT_HEIGHT + maxScroll;
  const thumbHeight = Math.max(30, (CONTENT_HEIGHT / totalContentHeight) * trackHeight);
  const thumbTop = maxScroll > 0
    ? (scrollY / maxScroll) * (trackHeight - thumbHeight)
    : 0;

  return (
    <div
      className="absolute right-[3px] pointer-events-none"
      style={{ top: 8, height: trackHeight, width: 4 }}
    >
      <div
        className="absolute w-full rounded-full bg-gray-400/40"
        style={{
          height: thumbHeight,
          top: thumbTop,
          transition: 'top 150ms ease-out',
        }}
      />
    </div>
  );
}

function StatusBar() {
  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 bg-white"
      style={{ height: STATUS_BAR_HEIGHT, paddingTop: 14 }}
    >
      {/* Time */}
      <span className="text-[15px] font-semibold text-gray-900 tracking-tight">9:41</span>

      {/* Right indicators */}
      <div className="flex items-center gap-[6px]">
        {/* Signal bars */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#0a0a0a" />
          <rect x="4" y="5.5" width="3" height="6.5" rx="0.5" fill="#0a0a0a" />
          <rect x="8" y="3" width="3" height="9" rx="0.5" fill="#0a0a0a" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" fill="#0a0a0a" />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" fill="#0a0a0a" />
          <path d="M4.93 8.76a4.36 4.36 0 016.14 0" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M2.4 6.23a7.64 7.64 0 0111.2 0" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M.1 3.6a10.96 10.96 0 0115.8 0" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" />
        </svg>

        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="#0a0a0a" strokeWidth="1" opacity="0.35" />
          <rect x="2" y="2" width="18" height="9" rx="1.5" fill="#0a0a0a" />
          <path d="M24 4.5v4a2 2 0 000-4z" fill="#0a0a0a" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

function BrowserBar({ screenType, config }: MockupRendererProps) {
  const url = getBrowserUrl(screenType, config);

  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-center px-6 bg-transparent border-b border-gray-200/20"
      style={{ top: STATUS_BAR_HEIGHT, height: BROWSER_BAR_HEIGHT }}
    >
      <div className="flex items-center gap-2 bg-gray-100/90 rounded-full px-3 h-[28px] w-full max-w-[320px]">
        {/* Lock icon */}
        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" className="shrink-0">
          <rect x="0.5" y="4.5" width="9" height="6" rx="1.5" stroke="#6b7280" strokeWidth="1" />
          <path d="M2.5 4.5V3a2.5 2.5 0 015 0v1.5" stroke="#6b7280" strokeWidth="1" fill="none" />
        </svg>
        <span className="text-[12px] text-gray-500 truncate">{url}</span>
      </div>
    </div>
  );
}

function getBrowserUrl(screenType: string, config: Record<string, any>): string {
  switch (screenType) {
    case 'storefront':
      return `vitrine.app/${(config.store_name || 'loja').toLowerCase().replace(/\s+/g, '')}`;
    case 'product_detail':
      return `vitrine.app/produto/${(config.product_title || 'item').toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`;
    case 'dashboard':
      return 'vitrine.app/dashboard';
    case 'my_products':
      return 'vitrine.app/dashboard/produtos';
    default:
      return 'vitrine.app';
  }
}

function ScreenContent({ screenType, config }: MockupRendererProps) {
  switch (screenType) {
    case 'storefront':
      return <MockupStorefront config={config} />;
    case 'product_detail':
      return <MockupProductDetail config={config} />;
    case 'dashboard':
      return <MockupDashboard config={config} />;
    case 'my_products':
      return <MockupMyProducts config={config} />;
    case 'custom':
      return <MockupCustom config={config} />;
    default:
      return <MockupCustom config={config} />;
  }
}
