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
    <div className="w-full relative bg-gray-50">
      <div style={{ width: 393 }}>
        <div className="px-4 py-6 space-y-4">
          {/* Header - exact ListingsHeader structure */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {config.page_title || 'Meus Produtos'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {config.product_count || products.length} produto(s) cadastrado(s)
                </p>
              </div>
              <div className="h-8 px-3 rounded-md bg-gray-900 text-white text-xs flex items-center gap-1.5 font-medium shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Novo Produto
              </div>
            </div>

            {/* Toolbar - exact view toggle + reorder */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View mode toggle - exact bg-muted/60 rounded-lg p-0.5 */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200/50">
                <button className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                }`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                }`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Reorder button */}
              <div className="h-8 px-3 rounded-md border border-gray-200 bg-white text-xs flex items-center gap-1.5 text-gray-700 font-medium">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22" /><path d="M17 7l-5-5-5 5M7 17l5 5 5-5" />
                </svg>
                Reordenar
              </div>
            </div>
          </div>

          {/* Search bar - exact pl-9 h-9 structure */}
          <div className="relative max-w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className="w-full h-9 pl-9 rounded-md border border-gray-200 bg-white flex items-center">
              <span className="text-sm text-gray-400">Buscar por nome, categoria ou marca...</span>
            </div>
          </div>

          {/* Filter pills - exact rounded-full px-3 py-1 text-xs */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-white shadow-sm">
              Todos
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200/50">
              Visiveis
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200/50">
              Ocultos
            </span>
          </div>

          {/* Product Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 6).map((product, i) => (
                <GridProductCard key={i} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {products.slice(0, 5).map((product, i) => (
                <ListProductRow key={i} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GridProductCard({ product }: { product: MyProductItem }) {
  return (
    <div className={`rounded-lg border bg-white shadow-sm overflow-hidden transition-all ${
      product.status === 'hidden' ? 'opacity-60' : ''
    }`} style={{ borderLeftWidth: product.stock_qty <= 3 ? 3 : undefined, borderLeftColor: product.stock_qty === 0 ? '#ef4444' : product.stock_qty <= 3 ? '#f59e0b' : undefined }}>
      {/* Image - exact aspect-square with inner container */}
      <div className="relative aspect-square overflow-hidden p-1.5">
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {product.image_url ? (
            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>

        {/* Hidden overlay */}
        {product.status === 'hidden' && (
          <div className="absolute inset-1.5 rounded-lg bg-black/20 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </div>
        )}

        {/* Selection checkbox area */}
        <div className="absolute top-3 left-3">
          <div className="h-4 w-4 rounded border border-gray-300 bg-white" />
        </div>
      </div>

      {/* Info section */}
      <div className="p-2 pt-1">
        <h3 className="font-semibold text-xs leading-tight line-clamp-2 min-h-[28px] text-gray-900">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-gray-900">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
        {/* Stats row */}
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
            {product.views_count}
          </span>
          <span>{product.stock_qty} un.</span>
        </div>
      </div>
    </div>
  );
}

function ListProductRow({ product }: { product: MyProductItem }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white ${
      product.status === 'hidden' ? 'opacity-60' : ''
    }`}>
      {/* Checkbox */}
      <div className="h-4 w-4 rounded border border-gray-300 bg-white shrink-0" />

      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
        <p className="text-xs text-gray-500">R$ {product.price.toFixed(2).replace('.', ',')}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
          {product.views_count}
        </span>
        <span>{product.stock_qty} un.</span>
      </div>

      {/* More button */}
      <div className="shrink-0">
        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
        </svg>
      </div>
    </div>
  );
}
