import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

export default function Footer() {
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;

    const readBgColor = () => {
      if (root.classList.contains('sf-themed')) {
        const sfBg = getComputedStyle(root).getPropertyValue('--sf-bg').trim();
        setBgColor(sfBg || undefined);
      } else {
        setBgColor(undefined);
      }
    };

    readBgColor();

    const observer = new MutationObserver(readBgColor);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => observer.disconnect();
  }, []);

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
      </div>
    </footer>
  );
}
