import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

export default function Footer() {
  const { slug } = useParams();
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchStorefrontAppearance = async () => {
      if (slug) {
        try {
          const { data: corretorData } = await supabase
            .from('users')
            .select('id, theme')
            .eq('slug', slug)
            .maybeSingle();

          if (corretorData?.id) {
            const { data: appearance } = await supabase
              .from('storefront_appearance')
              .select('bg_color, is_active')
              .eq('user_id', corretorData.id)
              .maybeSingle();

            if (appearance?.is_active && appearance.bg_color) {
              setBgColor(appearance.bg_color);
            }
          }
        } catch (error) {
          console.error('Error fetching storefront appearance:', error);
        }
      }
    };

    fetchStorefrontAppearance();
  }, [slug]);

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
