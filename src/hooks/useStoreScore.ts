import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ScoreCriterion {
  label: string;
  achieved: boolean;
  points: number;
}

interface StoreScoreData {
  score: number;
  criteria: ScoreCriterion[];
  loading: boolean;
}

export function useStoreScore() {
  const { user } = useAuth();
  const [data, setData] = useState<StoreScoreData>({
    score: 0,
    criteria: [],
    loading: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setData({ score: 0, criteria: [], loading: false });
      return;
    }
    calculateScore();
  }, [user?.id]);

  const calculateScore = async () => {
    if (!user?.id) return;

    try {
      setData(prev => ({ ...prev, loading: true }));

      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('id, featured_image_url, description, product_images(id)')
          .eq('user_id', user.id),
        supabase
          .from('user_product_categories')
          .select('id')
          .eq('user_id', user.id),
      ]);

      const products = productsRes.data || [];
      const categories = categoriesRes.data || [];

      const criteria: ScoreCriterion[] = [
        {
          label: 'Nome do negocio configurado',
          achieved: Boolean(user.name && user.name.trim().length >= 3),
          points: 10,
        },
        {
          label: 'Link da vitrine definido',
          achieved: Boolean(user.slug && user.slug.trim().length > 0),
          points: 10,
        },
        {
          label: 'WhatsApp configurado',
          achieved: Boolean(user.whatsapp && user.whatsapp.trim().length > 0),
          points: 15,
        },
        {
          label: 'Foto de perfil adicionada',
          achieved: Boolean(user.avatar_url),
          points: 10,
        },
        {
          label: 'Pelo menos 5 produtos cadastrados',
          achieved: products.length >= 5,
          points: 15,
        },
        {
          label: 'Todos os produtos com imagem',
          achieved: products.length > 0 && products.every(p => p.featured_image_url),
          points: 15,
        },
        {
          label: 'Produtos com descricao',
          achieved: products.length > 0 && products.filter(p => p.description && p.description.length > 10).length >= Math.ceil(products.length * 0.7),
          points: 10,
        },
        {
          label: 'Categorias organizadas',
          achieved: categories.length >= 2,
          points: 10,
        },
        {
          label: 'Instagram configurado',
          achieved: Boolean(user.instagram && user.instagram.trim().length > 0),
          points: 5,
        },
      ];

      const score = criteria.reduce((acc, c) => acc + (c.achieved ? c.points : 0), 0);

      setData({ score, criteria, loading: false });
    } catch {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  return data;
}
