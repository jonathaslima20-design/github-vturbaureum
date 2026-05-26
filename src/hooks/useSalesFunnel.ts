import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface FunnelStage {
  label: string;
  value: number;
  previousValue: number;
  change: number;
}

export interface SalesFunnelData {
  stages: FunnelStage[];
  loading: boolean;
}

export function useSalesFunnel() {
  const { user } = useAuth();
  const [data, setData] = useState<SalesFunnelData>({
    stages: [],
    loading: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setData({ stages: [], loading: false });
      return;
    }
    fetchFunnelData();
  }, [user?.id]);

  const fetchFunnelData = async () => {
    if (!user?.id) return;

    try {
      setData(prev => ({ ...prev, loading: true }));

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', user.id);

      const productIds = products?.map(p => p.id) || [];
      const safeIds = productIds.length > 0 ? productIds : ['00000000-0000-0000-0000-000000000000'];

      const [
        currentVisitors,
        currentViews,
        currentLeads,
        currentOrders,
        currentDelivered,
        prevVisitors,
        prevViews,
        prevLeads,
        prevOrders,
        prevDelivered,
      ] = await Promise.all([
        supabase
          .from('property_views')
          .select('viewer_id')
          .in('property_id', safeIds)
          .gte('viewed_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('property_views')
          .select('id', { count: 'exact', head: true })
          .in('property_id', safeIds)
          .gte('viewed_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .in('property_id', safeIds)
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_owner_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_owner_id', user.id)
          .eq('status', 'delivered')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        // Previous period
        supabase
          .from('property_views')
          .select('viewer_id')
          .in('property_id', safeIds)
          .gte('viewed_at', sixtyDaysAgo.toISOString())
          .lt('viewed_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('property_views')
          .select('id', { count: 'exact', head: true })
          .in('property_id', safeIds)
          .gte('viewed_at', sixtyDaysAgo.toISOString())
          .lt('viewed_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .in('property_id', safeIds)
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_owner_id', user.id)
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString()),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('store_owner_id', user.id)
          .eq('status', 'delivered')
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString()),
      ]);

      const uniqueVisitors = new Set(currentVisitors.data?.map(v => v.viewer_id) || []).size;
      const prevUniqueVisitors = new Set(prevVisitors.data?.map(v => v.viewer_id) || []).size;

      const calcChange = (curr: number, prev: number) =>
        prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;

      const stages: FunnelStage[] = [
        {
          label: 'Visitantes',
          value: uniqueVisitors,
          previousValue: prevUniqueVisitors,
          change: calcChange(uniqueVisitors, prevUniqueVisitors),
        },
        {
          label: 'Visualizacoes',
          value: currentViews.count || 0,
          previousValue: prevViews.count || 0,
          change: calcChange(currentViews.count || 0, prevViews.count || 0),
        },
        {
          label: 'Leads',
          value: currentLeads.count || 0,
          previousValue: prevLeads.count || 0,
          change: calcChange(currentLeads.count || 0, prevLeads.count || 0),
        },
        {
          label: 'Pedidos',
          value: currentOrders.count || 0,
          previousValue: prevOrders.count || 0,
          change: calcChange(currentOrders.count || 0, prevOrders.count || 0),
        },
        {
          label: 'Entregues',
          value: currentDelivered.count || 0,
          previousValue: prevDelivered.count || 0,
          change: calcChange(currentDelivered.count || 0, prevDelivered.count || 0),
        },
      ];

      setData({ stages, loading: false });
    } catch {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  return data;
}
