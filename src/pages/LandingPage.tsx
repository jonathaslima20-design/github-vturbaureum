import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Package, MessageCircle, Gift, Instagram, Settings2, Globe as Globe2, ChartBar as BarChart3, Check, Zap, ShoppingBag, TrendingUp, Users, Star, LogIn, ShoppingCart, Radio } from 'lucide-react';
import LandingSocialProof from '@/components/landing/LandingSocialProof';
import HeroPhoneCarousel from '@/components/landing/HeroPhoneCarousel';
import { supabase } from '@/lib/supabase';

function useLandingTracking() {
  useEffect(() => {
    let metaScript: HTMLScriptElement | null = null;
    let metaNoScript: HTMLElement | null = null;
    let gtmScript: HTMLScriptElement | null = null;
    let gtmNoScript: HTMLElement | null = null;
    let gtmDataLayer: HTMLScriptElement | null = null;

    (async () => {
      const { data } = await supabase
        .from('landing_tracking_config')
        .select('meta_pixel_id, google_tag_id')
        .maybeSingle();

      if (!data) return;

      // ── Meta Pixel ──────────────────────────────────────────────
      const pixelId = data.meta_pixel_id?.trim();
      if (pixelId) {
        metaScript = document.createElement('script');
        metaScript.id = 'meta-pixel-script';
        metaScript.innerHTML = `
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${pixelId}');fbq('track','PageView');
        `;
        document.head.appendChild(metaScript);

        metaNoScript = document.createElement('noscript');
        metaNoScript.id = 'meta-pixel-noscript';
        metaNoScript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>`;
        document.body.insertBefore(metaNoScript, document.body.firstChild);
      }

      // ── Google Tag (GTM or GA4) ──────────────────────────────────
      const tagId = data.google_tag_id?.trim();
      if (tagId) {
        if (tagId.startsWith('GTM-')) {
          // Google Tag Manager
          gtmDataLayer = document.createElement('script');
          gtmDataLayer.id = 'gtm-datalayer';
          gtmDataLayer.innerHTML = `window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`;
          document.head.appendChild(gtmDataLayer);

          gtmScript = document.createElement('script');
          gtmScript.id = 'gtm-script';
          gtmScript.async = true;
          gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${tagId}`;
          document.head.appendChild(gtmScript);

          gtmNoScript = document.createElement('noscript');
          gtmNoScript.id = 'gtm-noscript';
          gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${tagId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
          document.body.insertBefore(gtmNoScript, document.body.firstChild);
        } else {
          // GA4 / gtag.js
          gtmScript = document.createElement('script');
          gtmScript.id = 'ga4-script';
          gtmScript.async = true;
          gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
          document.head.appendChild(gtmScript);

          gtmDataLayer = document.createElement('script');
          gtmDataLayer.id = 'ga4-config';
          gtmDataLayer.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tagId}');`;
          document.head.appendChild(gtmDataLayer);
        }
      }
    })();

    return () => {
      [metaScript, metaNoScript, gtmScript, gtmNoScript, gtmDataLayer].forEach((el) => el?.remove());
    };
  }, []);
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const observed = new WeakSet<Element>();
    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };
    observeAll();
    const mutation = new MutationObserver(() => observeAll());
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-light' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display font-semibold text-[15px] text-ink-900">VitrineTurbo</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#recursos" className="font-mono-label uppercase text-[12px] text-ink-500 hover:text-ink-900 transition-colors">Recursos</a>
          <a href="#analytics" className="font-mono-label uppercase text-[12px] text-ink-500 hover:text-ink-900 transition-colors">Analytics</a>
          <a href="#precos" className="font-mono-label uppercase text-[12px] text-ink-500 hover:text-ink-900 transition-colors">Planos</a>
          <a href="#faq" className="font-mono-label uppercase text-[12px] text-ink-500 hover:text-ink-900 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#precos" className="hidden sm:inline-flex btn-ghost rounded-full px-4 py-2 text-[13px] font-display font-medium">
            Ver Planos
          </a>
          <Link to="/login" className="btn-primary rounded-full px-4 py-2 text-[13px] font-display font-medium inline-flex items-center gap-1.5">
            <LogIn size={14} />
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden bg-white">
      <div className="grid-bg" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="stagger max-w-4xl">
          <div className="inline-flex items-center gap-2 border hairline bg-white rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono-label uppercase text-[11px] text-ink-700">VitrineTurbo — v2.5</span>
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[64px] lg:text-[84px] leading-[1.02] tracking-[-0.035em] text-ink-900 mt-6">
            Seu Catálogo Digital em Minutos.
          </h1>
          <p className="text-ink-500 text-[18px] lg:text-[20px] max-w-2xl mt-6 leading-[1.5]">
            Pare de perder vendas por falta de organização. Tenha sua vitrine online e venda muito mais.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a href="/register" className="btn-primary rounded-full px-7 py-4 font-display font-medium text-[15px] inline-flex items-center gap-2">
              Criar Agora
              <ArrowRight size={16} />
            </a>
            <a href="#precos" className="btn-ghost rounded-full px-7 py-4 font-display font-medium text-[15px] inline-flex items-center">
              Ver Planos
            </a>
          </div>
        </div>
        <div className="reveal mt-16 lg:mt-20">
          <HeroPhoneCarousel />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ id, kicker, title }: { id?: string; kicker: string; title: string }) {
  return (
    <div className="max-w-3xl reveal">
      <div className="font-mono-label uppercase text-[11px] text-ink-500">{kicker}</div>
      <h2
        id={id}
        className="font-display font-semibold text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.05] tracking-[-0.035em] text-ink-900 mt-4"
      >
        {title}
      </h2>
    </div>
  );
}

function BentoCard({
  idx,
  title,
  Icon,
  className = '',
  children,
}: {
  idx: string;
  title: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`reveal card-hover rounded-2xl border hairline bg-surface p-6 lg:p-7 flex flex-col ${className}`}>
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg border hairline bg-white flex items-center justify-center">
          <Icon size={18} className="text-ink-900" strokeWidth={2} />
        </div>
        <span className="font-mono-label text-[10px] text-ink-400">{idx}</span>
      </div>
      <h3 className="font-display font-semibold text-[20px] lg:text-[22px] text-ink-900 tracking-[-0.02em] mt-6">
        {title}
      </h3>
      <div className="mt-5 flex-1">{children}</div>
    </div>
  );
}

function BentoGrid() {
  return (
    <section id="recursos" className="py-24 lg:py-32 bg-white border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading kicker="/ recursos" title="Tudo que você precisa para impulsionar suas vendas" />
        <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[minmax(200px,auto)] gap-4 mt-14">
          <BentoCard
            idx="01"
            title="Gestão Completa de Produtos"
            Icon={Package}
            className="lg:col-span-2 lg:row-span-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Camiseta Mith', price: 'R$ 149', tag: 'Novo', img: '/Camiseta_Oversized_Treino_Preta_Mith.png' },
                { name: 'Chuteira Mercurial', price: 'R$ 389', tag: '-20%', img: '/Chuteira_Nike_Campo_Mercurial.png' },
                { name: 'Bola Nike Pitch', price: 'R$ 219', img: '/Bola_de_Futebol_Campo_Nike_Pitch_Tea.png' },
                { name: 'Creatine 300g', price: 'R$ 129', img: '/Creatine_Pura_Black_Skull_300g.png' },
                { name: 'Mouse Redragon', price: 'R$ 279', tag: 'Top', img: '/Mouse_Gamer_Redragon_Nix_RGB.png' },
                { name: 'Raquete Shark Elite', price: 'R$ 649', img: '/Raquete_Beach_Tennis_Shark_Elite.png' },
              ].map(({ name, price, tag, img }) => (
                <div
                  key={name}
                  className="group relative aspect-[3/4] sm:aspect-square rounded-xl border hairline bg-white p-3 sm:p-2.5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  {tag && (
                    <span className="absolute top-2 right-2 z-10 font-mono-label uppercase text-[9px] sm:text-[8px] tracking-wider px-2 py-0.5 rounded-full bg-ink-900 text-white shadow-sm">
                      {tag}
                    </span>
                  )}
                  <div className="flex-1 rounded-lg bg-gradient-to-br from-white via-white to-surface overflow-hidden flex items-center justify-center">
                    <img
                      src={img}
                      alt={name}
                      loading="lazy"
                      className="w-[88%] h-[88%] object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-2.5 px-0.5 space-y-0.5">
                    <div className="text-[12px] sm:text-[10px] text-ink-500 truncate leading-tight">{name}</div>
                    <div className="font-display font-semibold text-[14px] sm:text-[11px] text-ink-900 leading-tight">{price}</div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard idx="02" title="WhatsApp Integrado" Icon={MessageCircle}>
            <div className="space-y-2">
              <div className="max-w-[85%] bg-surface rounded-2xl rounded-bl-sm px-3 py-2 text-[12px] text-ink-900 leading-snug">
                Olá, gostaria de mais informações sobre o produto Camiseta Reserva Orleans Masculina.
              </div>
              <div className="max-w-[85%] ml-auto bg-ink-900 text-white rounded-2xl rounded-br-sm px-3 py-2 text-[12px] leading-snug">
                Perfeito, me chamo Letícia e vou prosseguir com o seu atendimento!
              </div>
            </div>
          </BentoCard>

          <BentoCard idx="03" title="Indique e ganhe" Icon={Gift}>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono-label uppercase text-[10px] text-ink-400 mb-1">Ganhe até</div>
                <div className="font-display font-semibold text-[44px] leading-none tracking-[-0.03em] text-ink-900">R$ <span className="text-[52px]">100</span><span className="text-[28px]">,00</span></div>
                <div className="font-mono-label uppercase text-[10px] text-ink-400 mt-2">por usuário indicado</div>
              </div>
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface flex items-center justify-center">
                    <Users size={14} className="text-ink-500" />
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard idx="04" title="Carrinho de Compras" Icon={ShoppingCart}>
            <div className="space-y-2">
              {[
                { name: 'Camiseta Oversized Preta', qty: 2, price: 'R$ 89,90' },
                { name: 'Chuteira Nike Mercurial', qty: 1, price: 'R$ 349,00' },
                { name: 'Bola Nike Pitch Team', qty: 3, price: 'R$ 129,90' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border hairline bg-white px-3 py-2">
                  <div className="w-7 h-7 rounded-lg bg-ink-50 flex items-center justify-center flex-shrink-0">
                    <Package size={13} className="text-ink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-ink-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-ink-400">Qtd: {item.qty}</div>
                  </div>
                  <div className="text-[11px] font-semibold text-ink-900 flex-shrink-0">{item.price}</div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 px-1">
                <div className="font-mono-label uppercase text-[10px] text-ink-400">Total</div>
                <div className="text-[13px] font-semibold text-ink-900">R$ 918,60</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard idx="05" title="Pixel Meta & Google Tag" Icon={Radio}>
            <div className="space-y-3">
              {[
                { platform: 'Meta Pixel', label: 'Facebook & Instagram Ads', color: 'bg-blue-500', dot: 'bg-blue-500' },
                { platform: 'Google Tag', label: 'Google Ads & Analytics', color: 'bg-red-500', dot: 'bg-red-500' },
              ].map((item) => (
                <div key={item.platform} className="rounded-xl border hairline bg-white px-3 py-3 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-ink-900">{item.platform}</div>
                    <div className="text-[10px] text-ink-400">{item.label}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono-label uppercase text-[9px] text-emerald-600">Ativo</span>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border hairline bg-ink-50 px-3 py-2 flex items-center gap-2">
                <Zap size={11} className="text-ink-400 flex-shrink-0" />
                <span className="text-[10px] text-ink-500">Rastreie conversões em tempo real</span>
              </div>
            </div>
          </BentoCard>

          <BentoCard idx="06" title="Multi Idiomas e Moedas" Icon={Globe2}>
            <div className="flex flex-wrap gap-2">
              {['PT-BR', 'EN-US', 'ES-ES', 'BRL', 'USD', 'EUR'].map((p) => (
                <span key={p} className="font-mono-label text-[10px] uppercase px-2.5 py-1 rounded-full border hairline bg-white text-ink-700">
                  {p}
                </span>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  const metrics = [
    { Icon: Package, l: 'Total de Produtos', v: '1.847' },
    { Icon: BarChart3, l: 'Visualizações', v: '+58,3k' },
    { Icon: Users, l: 'Visitantes', v: '+12.490' },
    { Icon: TrendingUp, l: 'Conversões', v: '+3,7%' },
  ];
  return (
    <section id="analytics" className="py-24 lg:py-32 bg-surface border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal">
            <div className="font-mono-label uppercase text-[11px] text-ink-500">/ analytics</div>
            <h2 className="font-display font-semibold text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.05] tracking-[-0.035em] text-ink-900 mt-4">
              Decisões baseadas em dados reais.
            </h2>
            <p className="text-ink-500 text-[16px] lg:text-[18px] mt-6 leading-[1.5] max-w-xl">
              Tenha uma visão geral do seu negócio e acompanhe suas vendas de forma simples e intuitiva.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-10">
              {metrics.map(({ Icon, l, v }) => (
                <div key={l} className="rounded-2xl border hairline bg-white p-5">
                  <Icon size={18} className="text-ink-900" />
                  <div className="font-mono-label uppercase text-[10px] text-ink-400 mt-4">{l}</div>
                  <div className="font-display font-semibold text-[24px] text-ink-900 tracking-[-0.02em] mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <div
              className="rounded-3xl bg-white p-6 lg:p-8 border hairline"
              style={{ boxShadow: '0 30px 80px -40px rgba(10,10,10,0.2)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-ink-900" />
                  <span className="font-display font-medium text-[14px] text-ink-900">Visão geral</span>
                </div>
                <span className="font-mono-label uppercase text-[10px] text-ink-400">últimos 30d</span>
              </div>
              <svg viewBox="0 0 400 160" className="w-full h-auto">
                <defs>
                  <linearGradient id="vt-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 C40,100 60,60 100,70 C140,80 160,40 200,50 C240,60 260,90 300,70 C340,50 360,30 400,40 L400,160 L0,160 Z"
                  fill="url(#vt-area)"
                />
                <path
                  d="M0,120 C40,100 60,60 100,70 C140,80 160,40 200,50 C240,60 260,90 300,70 C340,50 360,30 400,40"
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t hairline">
                {[
                  { l: 'Visualizações', v: '58.3k' },
                  { l: 'Leads', v: '2.184' },
                ].map((m) => (
                  <div key={m.l}>
                    <div className="font-mono-label uppercase text-[10px] text-ink-400">{m.l}</div>
                    <div className="font-display font-semibold text-[20px] text-ink-900 tracking-[-0.02em] mt-1">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  tag,
  name,
  price,
  period,
  featured = false,
}: {
  tag: string;
  name: string;
  price: string;
  period: string;
  featured?: boolean;
}) {
  const benefits = [
    'Produtos ilimitados',
    'Categorias ilimitadas',
    'Catálogo Digital via Link',
    'Painel Administrativo',
    'Funcionalidade de carrinho de compras',
    'Configuração de links externos',
    'Integração com Meta Pixel e Google Tag',
    'Programa de Indicação ("Indique e Ganhe")',
  ];
  return (
    <div
      className={`reveal card-hover rounded-2xl p-7 lg:p-8 border hairline flex flex-col ${
        featured ? 'bg-ink-900 text-white' : 'bg-surface text-ink-900'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-display font-semibold text-[16px] ${featured ? 'text-white' : 'text-ink-900'}`}>
          {name}
        </span>
        <span
          className={`font-mono-label uppercase text-[10px] px-2.5 py-1 rounded-full border ${
            featured ? 'border-white/30 text-white' : 'hairline text-ink-500'
          }`}
        >
          {tag}
        </span>
      </div>
      <div className="mt-8 flex items-baseline gap-2">
        <span className="font-display font-semibold text-[44px] lg:text-[52px] tracking-[-0.03em] leading-none">{price}</span>
        <span className={`font-mono-label text-[12px] ${featured ? 'text-white/60' : 'text-ink-400'}`}>{period}</span>
      </div>
      <ul className="mt-8 space-y-3 flex-1">
        {benefits.map((b) => (
          <li key={b} className="flex items-center gap-3">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                featured ? 'bg-white/15' : 'bg-white border hairline'
              }`}
            >
              <Check size={12} strokeWidth={3} className={featured ? 'text-white' : 'text-ink-900'} />
            </span>
            <span className={`text-[14px] ${featured ? 'text-white/90' : 'text-ink-700'}`}>{b}</span>
          </li>
        ))}
      </ul>
      <a
        href="/register"
        className={`mt-8 rounded-full px-6 py-3.5 font-display font-medium text-[14px] inline-flex items-center justify-center gap-2 transition-colors ${
          featured
            ? 'bg-white text-ink-900 hover:bg-white/90'
            : 'btn-primary'
        }`}
      >
        Assinar Agora
        <ArrowRight size={14} />
      </a>
    </div>
  );
}

function SocialProofSection() {
  return (
    <section id="usuários" className="py-24 lg:py-32 bg-white border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading kicker="/ usuários" title="Junte-se a milhares de usuários do VitrineTurbo" />
        <LandingSocialProof />
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="precos" className="py-24 lg:py-32 bg-white border-t hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading kicker="/ planos" title="Escolha o plano ideal pra você" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-14">
          <PricingCard tag="Flexível" name="Trimestral" price="R$ 149,00" period="pagamento único" />
          <PricingCard tag="Mais escolhido" name="Semestral" price="R$ 229,00" period="pagamento único" featured />
          <PricingCard tag="Melhor valor" name="Anual" price="R$ 336,00" period="pagamento único" />
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const items = [
    {
      q: 'Preciso de cartão de crédito para começar?',
      a: 'Não. Você pode criar sua vitrine e explorar a plataforma sem nenhum compromisso inicial.',
    },
    {
      q: 'Existe taxa sobre as vendas?',
      a: 'Não cobramos nenhuma comissão sobre suas vendas. Você paga apenas o plano escolhido.',
    },
    {
      q: 'Funciona para qualquer nicho?',
      a: 'Sim. Moda, calçados, cosméticos, alimentos, serviços, decoração... A plataforma é flexível e se adapta ao seu negócio.',
    },
    {
      q: 'Como funciona o Indique e Ganhe?',
      a: 'Cada usuário recebe um link de indicação. Quando alguém assina por meio dele, você ganha comissão e crédito direto na conta.',
    },
    {
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim. O cancelamento é imediato e sem burocracia, diretamente no painel administrativo.',
    },
  ];
  return (
    <section id="faq" className="py-24 lg:py-32 bg-surface border-t hairline">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <SectionHeading kicker="/ dúvidas" title="Perguntas frequentes." />
        <div className="mt-12 divide-y hairline border-t border-b hairline">
          {items.map((it) => (
            <details key={it.q} className="reveal group py-6">
              <summary className="flex items-center justify-between cursor-pointer gap-6">
                <span className="font-display font-medium text-[17px] lg:text-[19px] text-ink-900 tracking-[-0.01em]">
                  {it.q}
                </span>
                <span className="w-9 h-9 rounded-full border hairline bg-white flex items-center justify-center shrink-0">
                  <Plus size={16} className="faq-icon text-ink-900" strokeWidth={2} />
                </span>
              </summary>
              <p className="mt-4 text-ink-500 text-[15px] leading-[1.5] max-w-2xl">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="py-24 lg:py-32 bg-white border-t hairline">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <h2 className="reveal font-display font-semibold text-[40px] sm:text-[56px] lg:text-[80px] leading-[1.04] tracking-[-0.035em] text-ink-900">
          Pronto para acelerar suas vendas?
        </h2>
        <div className="reveal mt-10">
          <a href="#top" className="btn-primary rounded-full px-8 py-4 text-[15px] font-display font-medium inline-flex items-center gap-2">
            Começar Agora
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function FooterLanding() {
  return (
    <footer className="border-t hairline bg-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-ink-900 flex items-center justify-center">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display font-semibold text-[14px] text-ink-900">VitrineTurbo</span>
        </div>
        <span className="font-mono-label uppercase text-[11px] text-ink-400">
          © 2026 — Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useReveal();
  useLandingTracking();
  return (
    <div className="vt-root min-h-screen bg-white text-ink-900">
      <Header />
      <Hero />
      <BentoGrid />
      <AnalyticsSection />
      <SocialProofSection />
      <PricingSection />
      <FaqSection />
      <FinalCTA />
      <FooterLanding />
    </div>
  );
}
