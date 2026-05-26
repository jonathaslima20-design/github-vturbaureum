import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface RevenueStats {
  totalRevenue: number;
  previousRevenue: number;
  revenueChange: number;
  averageTicket: number;
  totalDelivered: number;
  weeklyRevenue: { date: string; revenue: number }[];
  loading: boolean;
}

export function useDashboardRevenue() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    previousRevenue: 0,
    revenueChange: 0,
    averageTicket: 0,
    totalDelivered: 0,
    weeklyRevenue: [],
    loading: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }
    fetchRevenue();
  }, [user?.id]);

  const fetchRevenue = async () => {
    if (!user?.id) return;

    try {
      setStats(prev => ({ ...prev, loading: true }));

      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(now.getDate() - 60);

      const [currentResponse, previousResponse] = await Promise.all([
        supabase
          .from('orders')
          .select('total, created_at, status')
          .eq('store_owner_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .in('status', ['delivered', 'confirmed', 'preparing', 'shipped']),

        supabase
          .from('orders')
          .select('total')
          .eq('store_owner_id', user.id)
          .gte('created_at', sixtyDaysAgo.toISOString())
          .lt('created_at', thirtyDaysAgo.toISOString())
          .in('status', ['delivered', 'confirmed', 'preparing', 'shipped']),
      ]);

      const currentOrders = currentResponse.data || [];
      const previousOrders = previousResponse.data || [];

      const totalRevenue = currentOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const previousRevenue = previousOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const revenueChange = previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : totalRevenue > 0 ? 100 : 0;
      const totalDelivered = currentOrders.filter(o => o.status === 'delivered').length;
      const averageTicket = currentOrders.length > 0 ? totalRevenue / currentOrders.length : 0;

      const weeklyRevenue: { date: string; revenue: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(now.getDate() - i);
        const dayStr = day.toISOString().split('T')[0];
        const label = `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}`;

        const dayRevenue = currentOrders
          .filter(o => o.created_at.startsWith(dayStr))
          .reduce((sum, o) => sum + (o.total || 0), 0);

        weeklyRevenue.push({ date: label, revenue: dayRevenue });
      }

      setStats({
        totalRevenue,
        previousRevenue,
        revenueChange,
        averageTicket,
        totalDelivered,
        weeklyRevenue,
        loading: false,
      });
    } catch {
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  return stats;
}
