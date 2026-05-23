import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  { src: '/screen-1.png', label: 'Vitrine personalizada' },
  { src: '/screen-2.png', label: 'Catálogo de produtos' },
  { src: '/screen-3.png', label: 'Detalhes do produto' },
];

function IPhone16ProMax({ src, alt, eager }: { src: string; alt: string; eager: boolean }) {
  return (
    <div
      className="relative select-none"
      style={{
        width: 'clamp(170px, 46vw, 270px)',
        aspectRatio: '393 / 852',
        filter:
          'drop-shadow(0 50px 70px rgba(0,0,0,0.30)) drop-shadow(0 16px 28px rgba(0,0,0,0.18)) drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
      }}
    >
      {/* ── Solid black frame ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '14% / 6.4%',
          background: '#1a1a1a',
          padding: '3.2%',
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 2px 4px rgba(255,255,255,0.06), inset 0 -2px 4px rgba(0,0,0,0.4)',
          isolation: 'isolate',
          transform: 'translateZ(0)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden bg-white"
          style={{
            borderRadius: '9.5% / 4.4%',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            isolation: 'isolate',
            transform: 'translateZ(0)',
            WebkitMaskImage: '-webkit-radial-gradient(white, black)',
          }}
        >
          <img
            src={src}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          />

          {/* Dynamic Island */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              top: '1.6%',
              width: '32%',
              height: '4%',
              borderRadius: '50px',
              background: '#000',
              zIndex: 30,
              boxShadow: 'inset 0 0 0 1px rgba(40,40,45,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '10%',
            }}
          >
            <span
              className="block rounded-full"
              style={{
                width: '18%',
                height: '52%',
                background: 'radial-gradient(circle at 38% 38%, #243040 0%, #08121c 55%, #000 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(60,80,110,0.55)',
              }}
            />
          </div>

          {/* Screen glare */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 40,
              background:
                'linear-gradient(130deg, rgba(255,255,255,0.10) 0%, transparent 28%, transparent 72%, rgba(255,255,255,0.05) 100%)',
            }}
          />
        </div>
      </div>

      {/* ── Side buttons ── */}
      <span
        aria-hidden
        className="absolute"
        style={{
          left: '-2px',
          top: '14%',
          width: '2.5px',
          height: '3.5%',
          borderRadius: '2px 0 0 2px',
          background: '#0f0f0f',
        }}
      />
      <span
        aria-hidden
        className="absolute"
        style={{
          left: '-2px',
          top: '21%',
          width: '2.5px',
          height: '7%',
          borderRadius: '2px 0 0 2px',
          background: '#0f0f0f',
        }}
      />
      <span
        aria-hidden
        className="absolute"
        style={{
          left: '-2px',
          top: '30%',
          width: '2.5px',
          height: '7%',
          borderRadius: '2px 0 0 2px',
          background: '#0f0f0f',
        }}
      />
      <span
        aria-hidden
        className="absolute"
        style={{
          right: '-2px',
          top: '24%',
          width: '2.5px',
          height: '11%',
          borderRadius: '0 2px 2px 0',
          background: '#0f0f0f',
        }}
      />
    </div>
  );
}

export default function HeroPhoneCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion]);

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div
      className="relative mx-auto w-full overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Mockups do aplicativo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: '1400px', height: 'clamp(540px, 104vw, 620px)' }}
      >
        {SLIDES.map((slide, i) => {
          const total = SLIDES.length;
          let offset = i - active;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const abs = Math.abs(offset);

          const translateX = offset * (isMobile ? 52 : 60);
          const rotateY = offset * -10;
          const scale = isActive ? 1 : isMobile ? 0.68 : 0.80;
          const opacity = abs > 1 ? 0 : isActive ? 1 : 0.52;
          const zIndex = 10 - abs;

          return (
            <div
              key={slide.src}
              className="absolute top-1/2 left-1/2"
              aria-hidden={!isActive}
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms ease',
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <IPhone16ProMax src={slide.src} alt={slide.label} eager={isActive} />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Mockup anterior"
        onClick={() => go(-1)}
        className="hidden md:inline-flex absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border items-center justify-center hover:bg-white transition-colors shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="Próximo mockup"
        onClick={() => go(1)}
        className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border items-center justify-center hover:bg-white transition-colors shadow-sm"
      >
        <ChevronRight size={20} />
      </button>

      <div className="flex items-center justify-center gap-2 mt-8">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ir para ${slide.label}`}
            aria-current={i === active}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 28 : 8,
              background: i === active ? '#0a0a0a' : '#d4d4d8',
            }}
          />
        ))}
      </div>
    </div>
  );
}
