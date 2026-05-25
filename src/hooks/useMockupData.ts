import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface MockupProduct {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  featured_image_url: string | null;
}

interface MockupData {
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
  loading: boolean;
}

export function useMockupData(): MockupData {
  const { user } = useAuth();
  const [products, setProducts] = useState<MockupProduct[]>([]);
  const [categoryName, setCategoryName] = useState('Produtos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from('products')
          .select('id, name, price, discount_price, featured_image_url')
          .eq('user_id', user.id)
          .eq('is_visible', true)
          .order('display_order', { ascending: true })
          .limit(6),
        supabase
          .from('user_product_categories')
          .select('name')
          .eq('user_id', user.id)
          .order('display_order', { ascending: true })
          .limit(1),
      ]);

      if (productsResult.data) {
        setProducts(productsResult.data);
      }

      if (categoriesResult.data && categoriesResult.data.length > 0) {
        setCategoryName(categoriesResult.data[0].name);
      }

      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  return {
    name: user?.name || 'Minha Loja',
    bio: user?.bio || 'Confira nossos produtos incriveis!',
    avatar_url: user?.avatar_url || null,
    cover_url_mobile: user?.cover_url_mobile || user?.cover_url || null,
    promotional_banner_url_mobile: user?.promotional_banner_url_mobile || null,
    whatsapp: user?.whatsapp || null,
    instagram: user?.instagram || null,
    phone: user?.phone || null,
    location: user?.location || null,
    products,
    categoryName,
    loading,
  };
}
