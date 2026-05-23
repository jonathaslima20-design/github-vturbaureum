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
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '14% / 6.4%',
          background: '#1a1a1a',
          padding: '3.2%',
          boxShadow:
            '0 50px 70px rgba(0,0,0,0.25), 0 16px 28px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 2px 4px rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden bg-white"
          style={{ borderRadius: '9.5% / 4.4%' }}
        >
          <img
            src={src}
            alt={alt}
            width={393}
            height={852}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          />

          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-end"
            style={{
              top: '1.6%',
              width: '32%',
              height: '4%',
              borderRadius: '50px',
              background: '#000',
              zIndex: 30,
              paddingRight: '10%',
            }}
          >
            <span
              className="block rounded-full"
              style={{
                width: '18%',
                height: '52%',
                background: 'radial-gradient(circle at 38% 38%, #243040 0%, #08121c 55%, #000 100%)',
              }}
            />
          </div>
        </div>
      </div>

      <span aria-hidden className="absolute" style={{ left: '-2px', top: '14%', width: '2.5px', height: '3.5%', borderRadius: '2px 0 0 2px', background: '#0f0f0f' }} />
      <span aria-hidden className="absolute" style={{ left: '-2px', top: '21%', width: '2.5px', height: '7%', borderRadius: '2px 0 0 2px', background: '#0f0f0f' }} />
      <span aria-hidden className="absolute" style={{ left: '-2px', top: '30%', width: '2.5px', height: '7%', borderRadius: '2px 0 0 2px', background: '#0f0f0f' }} />
      <span aria-hidden className="absolute" style={{ right: '-2px', top: '24%', width: '2.5px', height: '11%', borderRadius: '0 2px 2px 0', background: '#0f0f0f' }} />
    </div>
  );
}

export default function HeroPhoneCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isVisible = useRef(true);

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
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(() => {
      if (isVisible.current) {
        setActive((i) => (i + 1) % SLIDES.length);
      }
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
      ref={containerRef}
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
        style={{ height: 'clamp(540px, 104vw, 620px)' }}
      >
        {SLIDES.map((slide, i) => {
          const total = SLIDES.length;
          let offset = i - active;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isActive = offset === 0;
          const abs = Math.abs(offset);

          const translateX = offset * (isMobile ? 52 : 60);
          const scale = isActive ? 1 : isMobile ? 0.68 : 0.80;
          const opacity = abs > 1 ? 0 : isActive ? 1 : 0.52;
          const zIndex = 10 - abs;

          return (
            <div
              key={slide.src}
              className="absolute top-1/2 left-1/2"
              aria-hidden={!isActive}
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
                willChange: abs <= 1 ? 'transform, opacity' : 'auto',
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
