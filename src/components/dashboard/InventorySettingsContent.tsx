import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader as Loader2, Package } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function InventorySettingsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enableInventory, setEnableInventory] = useState(false);
  const [showStockOnStorefront, setShowStockOnStorefront] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('user_storefront_settings')
        .select('id, settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setSettingsId(data.id);
        setEnableInventory(data.settings?.enableInventory ?? false);
        setShowStockOnStorefront(data.settings?.showStockOnStorefront ?? false);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user?.id]);

  const handleSave = async (inventoryEnabled: boolean, stockOnStorefront: boolean) => {
    if (!user?.id) return;
    setSaving(true);

    try {
      if (settingsId) {
        const { data: current } = await supabase
          .from('user_storefront_settings')
          .select('settings')
          .eq('id', settingsId)
          .maybeSingle();

        const updatedSettings = {
          ...(current?.settings || {}),
          enableInventory: inventoryEnabled,
          showStockOnStorefront: stockOnStorefront,
        };

        const { error } = await supabase
          .from('user_storefront_settings')
          .update({ settings: updatedSettings })
          .eq('id', settingsId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('user_storefront_settings')
          .insert({
            user_id: user.id,
            settings: {
              enableInventory: inventoryEnabled,
              showStockOnStorefront: stockOnStorefront,
            },
          })
          .select('id')
          .maybeSingle();

        if (error) throw error;
        if (data) setSettingsId(data.id);
      }

      setEnableInventory(inventoryEnabled);
      setShowStockOnStorefront(stockOnStorefront);
      toast.success('Configuracoes de estoque salvas');
    } catch (error) {
      console.error('Error saving inventory settings:', error);
      toast.error('Erro ao salvar configuracoes');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleInventory = (checked: boolean) => {
    if (!checked && enableInventory) {
      setShowDisableDialog(true);
      return;
    }
    handleSave(checked, showStockOnStorefront);
  };

  const handleConfirmDisable = () => {
    setShowDisableDialog(false);
    handleSave(false, false);
  };

  const handleToggleShowStock = (checked: boolean) => {
    handleSave(enableInventory, checked);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Controle de Estoque</CardTitle>
          </div>
          <CardDescription>
            Gerencie a quantidade de produtos disponíveis na sua loja. Esta funcionalidade é opcional e pode ser desativada a qualquer momento sem perder dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Gerenciar estoque dos produtos</p>
              <p className="text-xs text-muted-foreground">
                Ativa a opção de controlar quantidade em cada produto individualmente
              </p>
            </div>
            <Switch
              checked={enableInventory}
              onCheckedChange={handleToggleInventory}
              disabled={saving}
            />
          </div>

          {enableInventory && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Mostrar estoque na vitrine</p>
                <p className="text-xs text-muted-foreground">
                  Exibe a quantidade disponível para o cliente na página do produto. Produtos com estoque baixo sempre mostram "Últimas unidades" independente desta configuração.
                </p>
              </div>
              <Switch
                checked={showStockOnStorefront}
                onCheckedChange={handleToggleShowStock}
                disabled={saving}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar controle de estoque?</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados de estoque dos seus produtos serão preservados, mas o controle automático será pausado. Badges de estoque não aparecerão mais na vitrine. Produtos que estejam com estoque zerado continuarão com o status atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDisable}>
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
