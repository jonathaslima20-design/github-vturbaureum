import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

export default function Footer() {
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);
  const [hideBranding, setHideBranding] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const readState = () => {
      if (root.classList.contains('sf-themed')) {
        const sfBg = getComputedStyle(root).getPropertyValue('--sf-bg').trim();
        setBgColor(sfBg || undefined);
      } else {
        setBgColor(undefined);
      }
      setHideBranding(root.hasAttribute('data-hide-branding'));
    };

    readState();

    const observer = new MutationObserver(readState);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'style', 'data-hide-branding'] });

    return () => observer.disconnect();
  }, []);

  if (hideBranding) {
    return null;
  }

  return (
    <footer className="mt-auto py-6 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col items-center space-y-0.5">
        <Link to="/" className="mb-0.5" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
          <Logo size="md" showText={false} backgroundColor={bgColor} />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
            Crie sua Vitrine Digital
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground/70 mt-1">
          <Link to="/politica-de-privacidade" className="hover:text-muted-foreground transition-colors">
            Privacidade
          </Link>
          <Link to="/politica-de-cookies" className="hover:text-muted-foreground transition-colors">
            Cookies
          </Link>
          <Link to="/termos-de-uso" className="hover:text-muted-foreground transition-colors">
            Termos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
}
