import { useRef, useState, useEffect } from 'react';
import { MockupStorefront } from './MockupStorefront';
import { MockupProductDetail } from './MockupProductDetail';
import { MockupDashboard } from './MockupDashboard';
import { MockupMyProducts } from './MockupMyProducts';
import { MockupCustom } from './MockupCustom';

const REAL_WIDTH = 393;

interface MockupRendererProps {
  screenType: string;
  config: Record<string, any>;
}

export function MockupRenderer({ screenType, config }: MockupRendererProps) {
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

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: REAL_WIDTH,
          height: REAL_WIDTH * (852 / 393),
          transform: `scale(${scale})`,
        }}
      >
        <ScreenContent screenType={screenType} config={config} />
      </div>
    </div>
  );
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


export { MockupRenderer }