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
  const products = config.products || [];
  const bgColor = config.bg_color || '#ffffff';
  const textColor = config.text_color || '#0a0a0a';
  const accentColor = config.accent_color || '#0f172a';

  return (
    <div className="w-full relative" style={{ backgroundColor: bgColor }}>
      <div style={{ width: 393 }}>
        {/* CorretorHeader replica */}
        <div className="px-4 pt-4 pb-0">
          <div>
            {/* Cover Image - exact rounded-[52px] aspect-[960/860] */}
            <div className="w-full overflow-hidden rounded-[52px]" style={{ aspectRatio: '960/860' }}>
              {config.cover_url ? (
                <img src={config.cover_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
              )}
            </div>
          </div>

          <div className="px-5">
            {/* Avatar - exact -mt-20, w-48 h-48, border-4, shadow-lg */}
            <div className="relative -mt-20 mb-4 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full border-4 border-white bg-gray-200 shadow-lg overflow-hidden flex items-center justify-center">
                {config.avatar_url ? (
                  <img src={config.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-500">
                    {(config.store_name || 'L')[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="mt-4 text-2xl font-bold text-center" style={{ color: textColor }}>
                {config.store_name || 'Minha Loja'}
              </h1>

              {/* Bio */}
              {config.bio && (
                <p className="mt-4 text-center max-w-[320px] opacity-60" style={{ color: textColor }}>
                  {config.bio}
                </p>
              )}

              {/* Social Buttons - exact h-14 w-14 rounded-full gap-4 */}
              {config.social_buttons && config.social_buttons.length > 0 && (
                <div className="mt-6 flex items-center gap-4">
                  {config.social_buttons.map((btn, i) => (
                    <div
                      key={i}
                      className="h-14 w-14 rounded-full border border-gray-200 flex items-center justify-center bg-white/80"
                    >
                      <SocialIcon type={btn} color={textColor} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category title + Product Grid */}
        <div className="px-4 mt-2">
          <h2 className="text-lg font-semibold mb-3" style={{ color: textColor }}>
            {config.category_name || 'Produtos'}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map((product, i) => (
              <ProductCardReplica key={i} product={product} accent={accentColor} textColor={textColor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardReplica({ product, accent, textColor }: { product: StorefrontProduct; accent: string; textColor: string }) {
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow overflow-hidden flex flex-col">
      {/* Image - exact aspect-square p-2, inner rounded-lg border */}
      <div className="relative aspect-square overflow-hidden p-2">
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {product.image_url ? (
            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
        </div>

        {/* Badge top-right - exact positioning top-3 right-3 */}
        {hasDiscount && discountPercentage && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
              -{discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Info - exact p-2, title font-semibold text-xs line-clamp-2, price text-sm font-bold */}
      <div className="p-2 flex-1 flex flex-col">
        <h3 className="font-semibold text-xs leading-tight mb-2 line-clamp-2 min-h-[32px]" style={{ color: textColor }}>
          {product.title}
        </h3>
        <div className="mt-auto">
          {hasDiscount ? (
            <div className="space-y-0.5">
              <div className="text-[10px] text-gray-400 line-through">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-sm font-bold" style={{ color: accent }}>
                R$ {product.discount_price!.toFixed(2).replace('.', ',')}
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold" style={{ color: accent }}>
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>
          )}

          {/* Add to cart button - exact mt-2 pt-1.5 border-t, h-7, text-[10px] */}
          <div className="mt-2 pt-1.5 border-t border-gray-100">
            <div
              className="w-full h-7 rounded-md flex items-center justify-center text-[10px] font-medium text-white"
              style={{ backgroundColor: accent }}
            >
              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              Adicionar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ type, color }: { type: string; color?: string }) {
  const cls = "h-6 w-6";
  const iconColor = color || '#374151';

  switch (type) {
    case 'cart':
      return (
        <svg className={cls} style={{ color: iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={cls} style={{ color: iconColor }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={cls} style={{ color: iconColor }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </svg>
      );
    case 'phone':
      return (
        <svg className={cls} style={{ color: iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} style={{ color: iconColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
