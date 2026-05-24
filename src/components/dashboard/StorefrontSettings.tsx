import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StorefrontFiltersManager from '@/components/dashboard/StorefrontFiltersManager';
import CategoryDisplaySettings from '@/components/dashboard/CategoryDisplaySettings';
import TrackingSettingsContent from '@/components/dashboard/TrackingSettingsContent';
import { useInventoryEnabled } from '@/hooks/useInventoryEnabled';
import { Warehouse, ArrowRight } from 'lucide-react';

export function StorefrontSettings() {
  const [activeTab, setActiveTab] = useState('filters');
  const navigate = useNavigate();
  const { inventoryEnabled } = useInventoryEnabled();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto gap-1">
          <TabsTrigger value="filters" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Filtros
          </TabsTrigger>
          <TabsTrigger value="organization" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Organização
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Estoque
          </TabsTrigger>
          <TabsTrigger value="tracking" className="text-xs sm:text-sm py-2 sm:py-2.5">
            Rastreamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters" className="mt-4 sm:mt-6">
          <StorefrontFiltersManager />
        </TabsContent>

        <TabsContent value="organization" className="mt-4 sm:mt-6">
          <CategoryDisplaySettings />
        </TabsContent>

        <TabsContent value="inventory" className="mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Controle de Estoque</CardTitle>
              </div>
              <CardDescription>
                As configuracoes de estoque agora possuem uma area dedicada no menu lateral.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={inventoryEnabled ? 'default' : 'secondary'} className="text-xs">
                      {inventoryEnabled ? 'Ativado' : 'Desativado'}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard/inventory/settings')}
                >
                  Gerenciar
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="mt-4 sm:mt-6">
          <TrackingSettingsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}