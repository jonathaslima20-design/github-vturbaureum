interface ProductDetailConfig {
  product_image_url?: string;
  product_title?: string;
  product_description?: string;
  price?: number;
  discount_price?: number | null;
  discount_badge?: string;
  color_options?: string[];
  size_options?: string[];
  button_text?: string;
  button_color?: string;
  seller_avatar_url?: string;
  seller_name?: string;
}

export function MockupProductDetail({ config }: { config: ProductDetailConfig }) {
  const buttonColor = config.button_color || '#0f172a';

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Product Image */}
      <div className="w-full aspect-[4/3] bg-slate-100 relative shrink-0">
        {config.product_image_url && (
          <img src={config.product_image_url} alt="" className="w-full h-full object-cover" />
        )}
        {config.discount_badge && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[3px] bg-green-600 text-white text-[7px] font-bold">
            {config.discount_badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-3 pt-2 flex-1 flex flex-col">
        <p className="font-semibold text-[9px] leading-tight text-gray-900">
          {config.product_title || 'Nome do Produto'}
        </p>
        {config.product_description && (
          <p className="text-[6.5px] text-gray-500 mt-0.5 line-clamp-2 leading-tight">
            {config.product_description}
          </p>
        )}

        {/* Price */}
        <div className="mt-1.5">
          {config.discount_price ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[7px] text-gray-400 line-through">
                R$ {(config.price || 0).toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] font-bold text-gray-900">
                R$ {config.discount_price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-gray-900">
              R$ {(config.price || 0).toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>

        {/* Color Options */}
        {config.color_options && config.color_options.length > 0 && (
          <div className="mt-2">
            <p className="text-[6px] text-gray-500 mb-1">Cor</p>
            <div className="flex gap-1">
              {config.color_options.slice(0, 6).map((color, i) => (
                <div
                  key={i}
                  className="w-[12px] h-[12px] rounded-full border border-gray-200"
                  style={{ backgroundColor: color, boxShadow: i === 0 ? '0 0 0 1.5px #0f172a' : undefined }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Size Options */}
        {config.size_options && config.size_options.length > 0 && (
          <div className="mt-2">
            <p className="text-[6px] text-gray-500 mb-1">Tamanho</p>
            <div className="flex gap-0.5 flex-wrap">
              {config.size_options.slice(0, 6).map((size, i) => (
                <div
                  key={i}
                  className="px-1.5 py-0.5 rounded-[3px] text-[6px] font-medium border"
                  style={{
                    borderColor: i === 0 ? buttonColor : '#e5e7eb',
                    backgroundColor: i === 0 ? buttonColor : 'transparent',
                    color: i === 0 ? '#ffffff' : '#374151',
                  }}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller Info */}
        {config.seller_name && (
          <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-gray-100">
            <div className="w-[16px] h-[16px] rounded-full bg-slate-200 overflow-hidden shrink-0">
              {config.seller_avatar_url && (
                <img src={config.seller_avatar_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-[6.5px] text-gray-600 truncate">{config.seller_name}</p>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-auto pb-3 pt-2">
          <div
            className="w-full py-1.5 rounded-[4px] text-center text-[7px] font-semibold text-white"
            style={{ backgroundColor: buttonColor }}
          >
            {config.button_text || 'Adicionar ao Carrinho'}
          </div>
        </div>
      </div>
    </div>
  );
}
