interface StorefrontProduct {
  title: string;
  image_url: string;
  price: number;
  discount_price: number | null;
}

interface StorefrontConfig {
  cover_url?: string;
  avatar_url?: string;
  store_name?: string;
  bio?: string;
  social_buttons?: string[];
  bg_color?: string;
  text_color?: string;
  accent_color?: string;
  category_name?: string;
  products?: StorefrontProduct[];
}

export function MockupStorefront({ config }: { config: StorefrontConfig }) {
  const bgColor = config.bg_color || '#ffffff';
  const textColor = config.text_color || '#0a0a0a';
  const accent = config.accent_color || '#0f172a';
  const products = config.products || [];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Cover */}
      <div className="w-full h-[72px] relative bg-gradient-to-br from-slate-200 to-slate-300 shrink-0">
        {config.cover_url && (
          <img src={config.cover_url} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-[22px] relative z-10 shrink-0">
        <div
          className="w-[44px] h-[44px] rounded-full border-[2px] border-white bg-slate-300 overflow-hidden shadow-sm"
        >
          {config.avatar_url && (
            <img src={config.avatar_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      {/* Store Name & Bio */}
      <div className="text-center px-3 mt-1.5 shrink-0">
        <p className="font-semibold text-[9px] leading-tight truncate" style={{ color: textColor }}>
          {config.store_name || 'Minha Loja'}
        </p>
        {config.bio && (
          <p className="text-[6.5px] mt-0.5 opacity-60 line-clamp-2 leading-tight" style={{ color: textColor }}>
            {config.bio}
          </p>
        )}
      </div>

      {/* Social Buttons */}
      {config.social_buttons && config.social_buttons.length > 0 && (
        <div className="flex justify-center gap-1.5 mt-1.5 shrink-0">
          {config.social_buttons.map((btn, i) => (
            <div
              key={i}
              className="w-[18px] h-[18px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              <div className="w-[8px] h-[8px] rounded-full bg-white/80" />
            </div>
          ))}
        </div>
      )}

      {/* Category Name */}
      <div className="px-3 mt-3 shrink-0">
        <p className="font-semibold text-[8px]" style={{ color: textColor }}>
          {config.category_name || 'Produtos'}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-1.5 px-3 mt-1.5 flex-1 min-h-0">
        {products.slice(0, 4).map((product, i) => (
          <div key={i} className="rounded-[4px] overflow-hidden bg-white/60 border border-black/5">
            <div className="w-full aspect-square bg-slate-200 relative">
              {product.image_url && (
                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
              )}
              {product.discount_price && (
                <div
                  className="absolute top-[2px] left-[2px] px-[3px] py-[1px] rounded-[2px] text-white text-[5px] font-bold"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </div>
              )}
            </div>
            <div className="p-1">
              <p className="text-[6px] font-medium leading-tight line-clamp-2" style={{ color: textColor }}>
                {product.title}
              </p>
              <div className="mt-0.5">
                {product.discount_price ? (
                  <>
                    <p className="text-[5px] line-through opacity-40">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-[7px] font-bold" style={{ color: accent }}>
                      R$ {product.discount_price.toFixed(2).replace('.', ',')}
                    </p>
                  </>
                ) : (
                  <p className="text-[7px] font-bold" style={{ color: accent }}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
