import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface InventorySettings {
  inventoryEnabled: boolean;
  showStockOnStorefront: boolean;
  loading: boolean;
}

export function useInventoryEnabled(): InventorySettings {
  const { user } = useAuth();
  const [inventoryEnabled, setInventoryEnabled] = useState(false);
  const [showStockOnStorefront, setShowStockOnStorefront] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setInventoryEnabled(false);
      setShowStockOnStorefront(false);
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_storefront_settings')
        .select('settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data?.settings) {
        setInventoryEnabled(data.settings.enableInventory ?? false);
        setShowStockOnStorefront(data.settings.showStockOnStorefront ?? false);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user?.id]);

  return { inventoryEnabled, showStockOnStorefront, loading };
}

export function useInventoryEnabledForStore(storeOwnerId: string | undefined) {
  const [inventoryEnabled, setInventoryEnabled] = useState(false);
  const [showStockOnStorefront, setShowStockOnStorefront] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeOwnerId) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_storefront_settings')
        .select('settings')
        .eq('user_id', storeOwnerId)
        .maybeSingle();

      if (!error && data?.settings) {
        setInventoryEnabled(data.settings.enableInventory ?? false);
        setShowStockOnStorefront(data.settings.showStockOnStorefront ?? false);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [storeOwnerId]);

  return { inventoryEnabled, showStockOnStorefront, loading };
}
