import { MessageCircle, Instagram, Phone, MapPin, Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import { type StorefrontAppearance, getRadiusPx, getShadowCss, getSpacingValue, getFontSizeScale } from '@/lib/appearanceDefaults';
import { shouldUseLightLogo } from '@/utils/colorUtils';
import { formatCurrencyI18n } from '@/lib/i18n';

interface MockupProduct {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  featured_image_url: string | null;
}

interface PhoneMockupProps {
  appearance: StorefrontAppearance;
  name: string;
  bio: string;
  avatar_url: string | null;
  cover_url_mobile: string | null;
  promotional_banner_url_mobile: string | null;
  whatsapp: string | null;
  instagram: string | null;
  phone: string | null;
  location: string | null;
  products: MockupProduct[];
  categoryName: string;
}

export function PhoneMockup({
  appearance,
  name,
  bio,
  avatar_url,
  cover_url_mobile,
  promotional_banner_url_mobile,
  whatsapp,
  instagram,
  phone,
  location,
  products,
  categoryName,
}: PhoneMockupProps) {
  const useLightLogo = shouldUseLightLogo(appearance.bg_color);
  const logoSrc = useLightLogo
    ? '/logos/vitrinelogo-white.png'
    : '/logos/vitrinelogo-black.png';

  const cardRadius = getRadiusPx(appearance.card_border_radius);
  const btnRadius = getRadiusPx(appearance.button_border_radius);
  const imgRadius = getRadiusPx(appearance.image_border_radius);
  const shadow = getShadowCss(appearance.card_shadow);
  const sectionGap = getSpacingValue(appearance.section_spacing, 'section');
  const cardGap = getSpacingValue(appearance.card_gap, 'gap');
  const fontScale = getFontSizeScale(appearance.font_size_base);

  const coverRadius = (() => {
    const map: Record<string, string> = { none: '0px', sm: '8px', md: '12px', lg: '16px', xl: '24px' };
    return map[appearance.cover_border_radius] || '0px';
  })();

  const socialButtons = [
    { icon: MessageCircle, show: !!whatsapp },
    { icon: Instagram, show: !!instagram },
    { icon: Phone, show: !!phone },
    { icon: MapPin, show: !!location },
    { icon: ShoppingCart, show: true },
  ].filter(b => b.show);

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
      <div
        className="relative bg-black rounded-[44px] p-[10px] shadow-2xl"
        style={{ width: '290px', height: '600px' }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-full z-20" />

        {/* Screen */}
        <div
          className="w-full h-full rounded-[34px] overflow-hidden relative"
          style={{ backgroundColor: appearance.bg_color }}
        >
          {/* Scrollable content */}
          <div
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{
              fontFamily: `'${appearance.font_family}', sans-serif`,
              color: appearance.text_color,
              fontSize: `${parseFloat(fontScale) * 11}px`,
              lineHeight: '1.5',
            }}
          >
            {/* Cover Image */}
            <div
              className="relative w-full"
              style={{
                height: '120px',
                borderRadius: coverRadius === '0px' ? '0' : `0 0 ${coverRadius} ${coverRadius}`,
                overflow: 'hidden',
              }}
            >
              {cover_url_mobile ? (
                <img
                  src={cover_url_mobile}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${appearance.accent_color}, ${appearance.button_bg_color})` }} />
              )}
              {appearance.cover_overlay_color && (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: appearance.cover_overlay_color, opacity: 0.4 }}
                />
              )}
            </div>

            {/* Avatar */}
            <div className="flex justify-center -mt-8 relative z-10">
              <div
                className="w-16 h-16 rounded-full border-[3px] overflow-hidden"
                style={{ borderColor: appearance.bg_color, backgroundColor: appearance.card_bg_color }}
              >
                {avatar_url ? (
                  <img src={avatar_url} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ color: appearance.muted_text_color }}>
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Bio */}
            <div className="text-center px-4 mt-2" style={{ marginBottom: sectionGap }}>
              <h1
                className="font-bold leading-tight"
                style={{
                  fontFamily: `'${appearance.heading_font_family}', sans-serif`,
                  color: appearance.heading_color,
                  fontSize: `${parseFloat(fontScale) * 14}px`,
                }}
              >
                {name}
              </h1>
              <p
                className="mt-1 line-clamp-2"
                style={{ color: appearance.muted_text_color, fontSize: `${parseFloat(fontScale) * 9}px` }}
              >
                {bio}
              </p>
            </div>

            {/* Social Buttons */}
            <div className="flex justify-center gap-2 px-4 mb-3">
              {socialButtons.map((btn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center w-8 h-8 transition-transform hover:scale-105"
                  style={{
                    backgroundColor: appearance.button_bg_color,
                    borderRadius: btnRadius,
                  }}
                >
                  <btn.icon size={13} style={{ color: appearance.button_text_color }} />
                </div>
              ))}
            </div>

            {/* Promotional Banner */}
            {promotional_banner_url_mobile && (
              <div className="px-3 mb-3">
                <img
                  src={promotional_banner_url_mobile}
                  alt="Banner"
                  className="w-full h-auto object-contain"
                  style={{ borderRadius: imgRadius }}
                />
              </div>
            )}

            {/* Search Bar */}
            <div className="px-3 mb-3">
              <div
                className="flex items-center gap-2 px-2.5 py-1.5"
                style={{
                  backgroundColor: appearance.card_bg_color,
                  border: `1px solid ${appearance.border_color}`,
                  borderRadius: btnRadius,
                }}
              >
                <Search size={11} style={{ color: appearance.muted_text_color }} />
                <span style={{ color: appearance.muted_text_color, fontSize: `${parseFloat(fontScale) * 9}px` }}>
                  Buscar produtos...
                </span>
                <div className="ml-auto">
                  <SlidersHorizontal size={11} style={{ color: appearance.icon_color }} />
                </div>
              </div>
            </div>

            {/* Category Title */}
            <div className="px-3" style={{ marginBottom: cardGap }}>
              <h2
                className="font-bold"
                style={{
                  fontFamily: `'${appearance.heading_font_family}', sans-serif`,
                  color: appearance.heading_color,
                  fontSize: `${parseFloat(fontScale) * 12}px`,
                }}
              >
                {categoryName}
              </h2>
            </div>

            {/* Product Grid */}
            <div
              className="px-3 grid grid-cols-2"
              style={{ gap: cardGap, marginBottom: sectionGap }}
            >
              {products.slice(0, 4).map((product) => (
                <ProductMockupCard
                  key={product.id}
                  product={product}
                  appearance={appearance}
                  cardRadius={cardRadius}
                  imgRadius={imgRadius}
                  shadow={shadow}
                  fontScale={fontScale}
                  btnRadius={btnRadius}
                />
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-4 flex flex-col items-center border-t"
              style={{ borderColor: appearance.border_color }}
            >
              <img src={logoSrc} alt="VitrineTurbo" className="h-6 w-auto mb-1" />
              <span style={{ color: appearance.muted_text_color, fontSize: '8px' }}>
                Crie sua Vitrine Digital
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductMockupCard({
  product,
  appearance,
  cardRadius,
  imgRadius,
  shadow,
  fontScale,
  btnRadius,
}: {
  product: MockupProduct;
  appearance: StorefrontAppearance;
  cardRadius: string;
  imgRadius: string;
  shadow: string;
  fontScale: string;
  btnRadius: string;
}) {
  const hasDiscount = product.discount_price && product.discount_price < product.price;

  return (
    <div
      className="overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: appearance.card_bg_color,
        border: `1px solid ${appearance.card_border_color}`,
        borderRadius: cardRadius,
        boxShadow: shadow,
      }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden" style={{ borderRadius: `${imgRadius} ${imgRadius} 0 0` }}>
        {product.featured_image_url ? (
          <img
            src={product.featured_image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: appearance.border_color }}>
            <ShoppingCart size={16} style={{ color: appearance.muted_text_color }} />
          </div>
        )}
        {hasDiscount && (
          <div
            className="absolute top-1 right-1 px-1 py-0.5"
            style={{
              backgroundColor: appearance.badge_bg_color,
              color: appearance.badge_text_color,
              borderRadius: '4px',
              fontSize: '7px',
              fontWeight: 600,
            }}
          >
            -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-1.5">
        <p
          className="font-medium line-clamp-2 leading-tight mb-1"
          style={{
            color: appearance.text_color,
            fontSize: `${parseFloat(fontScale) * 9}px`,
          }}
        >
          {product.name}
        </p>
        <div className="flex items-center gap-1">
          {hasDiscount && (
            <span
              className="line-through"
              style={{ color: appearance.muted_text_color, fontSize: `${parseFloat(fontScale) * 7.5}px` }}
            >
              {formatCurrencyI18n(product.price, 'BRL', 'pt-BR')}
            </span>
          )}
          <span
            className="font-bold"
            style={{
              color: appearance.heading_color,
              fontSize: `${parseFloat(fontScale) * 9.5}px`,
            }}
          >
            {formatCurrencyI18n(hasDiscount ? product.discount_price! : product.price, 'BRL', 'pt-BR')}
          </span>
        </div>

        {/* Mini button */}
        <div
          className="mt-1.5 w-full text-center py-1 font-medium"
          style={{
            backgroundColor: appearance.button_bg_color,
            color: appearance.button_text_color,
            borderRadius: btnRadius,
            fontSize: `${parseFloat(fontScale) * 8}px`,
          }}
        >
          Ver detalhes
        </div>
      </div>
    </div>
  );
}
