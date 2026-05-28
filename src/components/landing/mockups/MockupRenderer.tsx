import { MockupStorefront } from './MockupStorefront';
import { MockupProductDetail } from './MockupProductDetail';
import { MockupDashboard } from './MockupDashboard';
import { MockupMyProducts } from './MockupMyProducts';
import { MockupCustom } from './MockupCustom';

interface MockupRendererProps {
  screenType: string;
  config: Record<string, any>;
}

export function MockupRenderer({ screenType, config }: MockupRendererProps) {
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
