interface MyProductItem {
  title: string;
  image_url: string;
  price: number;
  views_count: number;
  status: 'visible' | 'hidden';
  stock_qty: number;
}

interface MyProductsConfig {
  page_title?: string;
  product_count?: number;
  view_mode?: 'grid' | 'list';
  products?: MyProductItem[];
}

export function MockupMyProducts({ config }: { config: MyProductsConfig }) {
  const products = config.products || [];
  const viewMode = config.view_mode || 'grid';

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb]">
      {/* Header */}
      <div className="px-3 pt-4 pb-2 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-900">
              {config.page_title || 'Meus Produtos'}
            </p>
            <p className="text-[6px] text-gray-500 mt-0.5">
              {config.product_count || products.length} produto(s) cadastrado(s)
            </p>
          </div>
          <div className="px-1.5 py-0.5 rounded-[3px] bg-gray-900 text-white text-[6px] font-medium flex items-center gap-0.5">
            <svg className="w-[6px] h-[6px]" viewBox="0 0 12 12" fill="none">
              <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Novo
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 shrink-0">
        <div className="flex-1 flex items-center gap-0.5 px-1.5 py-[3px] rounded-[3px] bg-white border border-gray-200">
          <svg className="w-[7px] h-[7px] text-gray-400" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-[5.5px] text-gray-400">Buscar...</span>
        </div>
        <div className="flex items-center gap-0.5 px-1 py-[3px] rounded-[3px] bg-white border border-gray-200">
          <ViewIcon mode={viewMode} />
        </div>
      </div>

      {/* Products */}
      <div className="flex-1 min-h-0 px-3 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-1.5">
            {products.slice(0, 6).map((product, i) => (
              <ProductGridCard key={i} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {products.slice(0, 5).map((product, i) => (
              <ProductListRow key={i} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductGridCard({ product }: { product: MyProductItem }) {
  return (
    <div className="bg-white rounded-[4px] overflow-hidden border border-gray-100 shadow-sm">
      <div className="w-full aspect-square bg-slate-100 relative">
        {product.image_url && (
          <img src={product.image_url} alt="" className="w-full h-full object-cover" />
        )}
        {product.status === 'hidden' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <svg className="w-[10px] h-[10px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-1">
        <p className="text-[6px] font-medium text-gray-900 truncate">{product.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[7px] font-bold text-gray-900">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[5px] text-gray-400">{product.views_count} views</span>
        </div>
      </div>
    </div>
  );
}

function ProductListRow({ product }: { product: MyProductItem }) {
  return (
    <div className="flex items-center gap-1.5 bg-white rounded-[3px] p-1 border border-gray-100">
      <div className="w-[22px] h-[22px] rounded-[2px] bg-slate-100 overflow-hidden shrink-0">
        {product.image_url && (
          <img src={product.image_url} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[6px] font-medium text-gray-900 truncate">{product.title}</p>
        <p className="text-[5.5px] text-gray-500">R$ {product.price.toFixed(2).replace('.', ',')}</p>
      </div>
      <div className="text-[5px] text-gray-400 shrink-0">
        {product.stock_qty} un.
      </div>
    </div>
  );
}

function ViewIcon({ mode }: { mode: string }) {
  if (mode === 'grid') {
    return (
      <svg className="w-[8px] h-[8px] text-gray-600" viewBox="0 0 12 12" fill="currentColor">
        <rect x="0" y="0" width="5" height="5" rx="1" />
        <rect x="7" y="0" width="5" height="5" rx="1" />
        <rect x="0" y="7" width="5" height="5" rx="1" />
        <rect x="7" y="7" width="5" height="5" rx="1" />
      </svg>
    );
  }
  return (
    <svg className="w-[8px] h-[8px] text-gray-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="0" y1="2" x2="12" y2="2" />
      <line x1="0" y1="6" x2="12" y2="6" />
      <line x1="0" y1="10" x2="12" y2="10" />
    </svg>
  );
}
