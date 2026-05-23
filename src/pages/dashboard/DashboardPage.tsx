import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, Users, DollarSign, Loader as Loader2, ExternalLink } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ViewsAndLeadsChart } from '@/components/dashboard/ViewsAndLeadsChart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalProducts, totalViews, uniqueVisitors, totalLeads, loading, error } = useDashboardStats();

  const getMissingProfileFields = () => {
    const missing: string[] = [];
    if (!user?.name?.trim()) missing.push('nome');
    if (!user?.slug?.trim()) missing.push('link da vitrine');
    if (!user?.whatsapp?.trim()) missing.push('WhatsApp');
    return missing;
  };

  const handleViewStorefront = () => {
    const missing = getMissingProfileFields();

    if (missing.length > 0) {
      const fieldList = missing.join(', ');
      toast.warning('Perfil incompleto', {
        description: `Complete os campos obrigatórios antes de visualizar sua vitrine: ${fieldList}.`,
        action: {
          label: 'Configurar agora',
          onClick: () => navigate('/dashboard/settings'),
        },
        duration: 6000,
      });
      return;
    }

    window.open(`https://vitrineturbo.com/${user!.slug}`, '_blank');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {user?.name || 'Usuário'}!</p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleViewStorefront}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Minha Vitrine
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">produtos cadastrados</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">nos últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{uniqueVisitors}</div>
                <p className="text-xs text-muted-foreground">visitantes únicos</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalLeads}</div>
                <p className="text-xs text-muted-foreground">contatos recebidos</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <ViewsAndLeadsChart days={7} />
      </div>
    </div>
  );
}
