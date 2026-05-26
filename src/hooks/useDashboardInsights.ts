import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'alert';
  title: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

export function useDashboardInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    generateInsights();
  }, [user?.id]);

  const generateInsights = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const { data: products } = await supabase
        .from('products')
        .select('id, title, track_inventory, stock_quantity')
        .eq('user_id', user.id);

      const productIds = products?.map(p => p.id) || [];

      if (productIds.length === 0) {
        setInsights([{
          id: 'no-products',
          type: 'info',
          title: 'Comece agora',
          message: 'Adicione seu primeiro produto para comecar a receber visitantes e leads.',
          actionLabel: 'Adicionar produto',
          actionPath: '/dashboard/create-product',
        }]);
        setLoading(false);
        return;
      }

      const [viewsResponse, leadsResponse, thisWeekLeads, lastWeekLeads] = await Promise.all([
        supabase
          .from('property_views')
          .select('property_id')
          .in('property_id', productIds)
          .gte('viewed_at', thirtyDaysAgo.toISOString()),

        supabase
          .from('leads')
          .select('property_id')
          .in('property_id', productIds)
          .gte('created_at', thirtyDaysAgo.toISOString()),

        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .in('property_id', productIds)
          .gte('created_at', sevenDaysAgo.toISOString()),

        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .in('property_id', productIds)
          .gte('created_at', fourteenDaysAgo.toISOString())
          .lt('created_at', sevenDaysAgo.toISOString()),
      ]);

      const viewsByProduct = new Map<string, number>();
      (viewsResponse.data || []).forEach(v => {
        viewsByProduct.set(v.property_id, (viewsByProduct.get(v.property_id) || 0) + 1);
      });

      const leadsByProduct = new Map<string, number>();
      (leadsResponse.data || []).forEach(l => {
        leadsByProduct.set(l.property_id, (leadsByProduct.get(l.property_id) || 0) + 1);
      });

      const newInsights: Insight[] = [];

      // Products with high views but zero leads
      const highViewNoLead = products?.filter(p => {
        const views = viewsByProduct.get(p.id) || 0;
        const leads = leadsByProduct.get(p.id) || 0;
        return views >= 10 && leads === 0;
      }) || [];

      if (highViewNoLead.length > 0) {
        const topProduct = highViewNoLead.sort((a, b) =>
          (viewsByProduct.get(b.id) || 0) - (viewsByProduct.get(a.id) || 0)
        )[0];
        newInsights.push({
          id: 'high-views-no-leads',
          type: 'warning',
          title: 'Oportunidade perdida',
          message: `"${topProduct.title}" teve ${viewsByProduct.get(topProduct.id)} visualizacoes mas nenhum contato. Considere ajustar o preco ou as imagens.`,
          actionLabel: 'Ver produto',
          actionPath: `/dashboard/edit-product/${topProduct.id}`,
        });
      }

      // Out of stock products receiving visits
      const outOfStockWithViews = products?.filter(p => {
        const views = viewsByProduct.get(p.id) || 0;
        return p.track_inventory && (p.stock_quantity ?? 0) <= 0 && views > 0;
      }) || [];

      if (outOfStockWithViews.length > 0) {
        newInsights.push({
          id: 'out-of-stock-views',
          type: 'alert',
          title: 'Produtos esgotados com visitas',
          message: `Voce tem ${outOfStockWithViews.length} produto${outOfStockWithViews.length > 1 ? 's' : ''} sem estoque que ainda recebe${outOfStockWithViews.length > 1 ? 'm' : ''} visitas. Reponha o estoque para nao perder vendas.`,
          actionLabel: 'Ver estoque',
          actionPath: '/dashboard/inventory',
        });
      }

      // Lead growth
      const thisWeekCount = thisWeekLeads.count || 0;
      const lastWeekCount = lastWeekLeads.count || 0;

      if (thisWeekCount > lastWeekCount && lastWeekCount > 0) {
        const growth = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
        if (growth >= 20) {
          newInsights.push({
            id: 'lead-growth',
            type: 'success',
            title: 'Leads em alta',
            message: `Seus leads cresceram ${growth}% esta semana comparado a semana anterior. Continue assim!`,
          });
        }
      }

      // Lead decline
      if (lastWeekCount > 0 && thisWeekCount < lastWeekCount) {
        const decline = Math.round(((lastWeekCount - thisWeekCount) / lastWeekCount) * 100);
        if (decline >= 30) {
          newInsights.push({
            id: 'lead-decline',
            type: 'warning',
            title: 'Queda nos leads',
            message: `Seus leads cairam ${decline}% em relacao a semana passada. Considere compartilhar sua vitrine nas redes sociais.`,
          });
        }
      }

      // Best converting product
      const productsWithConversion = products?.map(p => ({
        ...p,
        views: viewsByProduct.get(p.id) || 0,
        leads: leadsByProduct.get(p.id) || 0,
        conversionRate: (viewsByProduct.get(p.id) || 0) > 0
          ? ((leadsByProduct.get(p.id) || 0) / (viewsByProduct.get(p.id) || 0)) * 100
          : 0,
      })).filter(p => p.views >= 5 && p.leads > 0) || [];

      if (productsWithConversion.length > 0) {
        const bestProduct = productsWithConversion.sort((a, b) => b.conversionRate - a.conversionRate)[0];
        if (bestProduct.conversionRate >= 10) {
          newInsights.push({
            id: 'best-conversion',
            type: 'success',
            title: 'Produto destaque',
            message: `"${bestProduct.title}" tem uma taxa de conversao de ${bestProduct.conversionRate.toFixed(0)}%. Este e o seu produto mais eficiente!`,
          });
        }
      }

      // Profile incomplete
      if (!user?.whatsapp || !user?.slug || !user?.name) {
        newInsights.push({
          id: 'profile-incomplete',
          type: 'info',
          title: 'Perfil incompleto',
          message: 'Complete seu perfil para que os clientes possam encontrar e entrar em contato com voce.',
          actionLabel: 'Completar perfil',
          actionPath: '/dashboard/settings',
        });
      }

      setInsights(newInsights.slice(0, 4));
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return { insights, loading };
}
