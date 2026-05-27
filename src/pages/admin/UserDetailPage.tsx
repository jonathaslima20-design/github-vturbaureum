import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ExternalLink, Ban, Phone, Instagram, MapPin, Calendar, Key, Lock, Trash2, Eye, CreditCard, DollarSign, CircleCheck as CheckCircle, Circle as XCircle, Clock, Image as ImageIcon, Gift, Loader as Loader2, Copy } from 'lucide-react';
import { EditImageLimitDialog } from '@/components/admin/EditImageLimitDialog';
import { toast } from 'sonner';
import { Product } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserStats {
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  totalValue: number;
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalProducts: 0,
    activeProducts: 0,
    soldProducts: 0,
    totalValue: 0,
  });
  const [activeTab, setActiveTab] = useState('produtos');
  const [showImageLimitDialog, setShowImageLimitDialog] = useState(false);
  const { subscription, recentPayments, loading: subscriptionLoading, refetch: refetchSubscription } = useUserSubscription(userId);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (userError) throw userError;
        if (!userData) {
          toast.error('Usuário não encontrado');
          navigate('/admin/users');
          return;
        }

        setUser(userData);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        setProducts(productsData || []);

        const totalProducts = productsData?.length || 0;
        const activeProducts = productsData?.filter(p => p.status === 'disponivel').length || 0;
        const soldProducts = productsData?.filter(p => p.status === 'vendido').length || 0;
        const totalValue = productsData?.reduce((sum, p) => {
          const price = p.discounted_price || p.price || 0;
          return sum + price;
        }, 0) || 0;

        setStats({
          totalProducts,
          activeProducts,
          soldProducts,
          totalValue,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleBlockUser = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: !user.is_blocked })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, is_blocked: !user.is_blocked });
      toast.success(user.is_blocked ? 'Usuário desbloqueado' : 'Usuário bloqueado');
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Erro ao bloquear/desbloquear usuário');
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        const errorMsg = result.results?.[0]?.error || result.error?.message || 'Erro ao excluir usuario';
        throw new Error(errorMsg);
      }

      toast.success('Usuário excluído com sucesso');
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Erro ao excluir usuário');
    }
  };

  const handleViewStorefront = () => {
    if (user?.slug) {
      window.open(`/${user.slug}`, '_blank');
    }
  };

  const handleImageLimitUpdate = async (maxImages: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ max_images_per_product: maxImages })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, max_images_per_product: maxImages });
      toast.success('Limite de imagens atualizado com sucesso');
      setShowImageLimitDialog(false);
    } catch (error) {
      console.error('Error updating image limit:', error);
      toast.error('Erro ao atualizar limite de imagens');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/users')}
            className="mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl page-title">Detalhes do Usuário</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Informações completas e gerenciamento
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleViewStorefront}
            className="gap-2"
            disabled={!user.slug}
          >
            <ExternalLink className="h-4 w-4" />
            Ver Vitrine
          </Button>
          <Button
            variant={user.is_blocked ? "default" : "destructive"}
            onClick={handleBlockUser}
            className="gap-2"
          >
            <Ban className="h-4 w-4" />
            {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 pb-6 space-y-6">
              <div className="text-center space-y-4">
                {user.avatar_url ? (
                  <div className="mx-auto w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl md:text-3xl page-title">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.role === 'admin' ? 'Administrador' : 'Vendedor'}
                  </Badge>
                  <Badge
                    variant={user.plan_status === 'active' ? 'default' : 'secondary'}
                    className={`text-xs gap-1 ${user.plan_status === 'free' ? 'border-blue-300 text-blue-700 bg-blue-50' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${user.plan_status === 'active' ? 'bg-green-500' : user.plan_status === 'free' ? 'bg-blue-400' : 'bg-gray-400'}`} />
                    {user.plan_status === 'active' ? 'Plano Ativo' : user.plan_status === 'free' ? 'Plano Free' : user.plan_status === 'suspended' ? 'Suspenso' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {user.whatsapp && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.whatsapp}</span>
                  </div>
                )}

                {user.instagram && (
                  <div className="flex items-center gap-3 text-sm">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                    <span>@{user.instagram}</span>
                  </div>
                )}

                {user.slug && (
                  <div className="flex items-center gap-3 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">/{user.slug}</span>
                  </div>
                )}

                {user.location_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Localização definida</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">
                    Cadastrado em {format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>

                {user.referral_code && (
                  <div className="flex items-start gap-3 text-sm">
                    <Key className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Código de Indicação:</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                        {user.referral_code}
                      </code>
                    </div>
                  </div>
                )}
              </div>

              {user.bio && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Biografia</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {user.bio}
                    </p>
                  </div>
                </>
              )}

              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full gap-2" disabled>
                  <Lock className="h-4 w-4" />
                  Alterar Senha
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full gap-2">
                      <Trash2 className="h-4 w-4" />
                      Excluir Usuário
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                        Todos os produtos e dados relacionados serão removidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Total de Produtos</p>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Produtos Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Vendidos</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.soldProducts}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-3xl font-bold">
                    R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
              <TabsTrigger value="indicacoes">Indicações</TabsTrigger>
            </TabsList>

            <TabsContent value="produtos" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-50 p-3">
                          <ImageIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Limite de Imagens por Produto</p>
                          <p className="text-2xl font-bold">{user?.max_images_per_product || 10}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowImageLimitDialog(true)}
                        variant="outline"
                        size="sm"
                      >
                        Editar Limite
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <EditImageLimitDialog
                  open={showImageLimitDialog}
                  onOpenChange={setShowImageLimitDialog}
                  userId={user?.id || ''}
                  userName={user?.name || ''}
                  currentLimit={user?.max_images_per_product || 10}
                  onUpdate={handleImageLimitUpdate}
                />
              </div>

              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Produtos</h3>
                      <p className="text-sm text-muted-foreground">
                        Lista de todos os produtos cadastrados por este usuário
                      </p>
                    </div>

                    {products.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        Nenhum produto cadastrado
                      </div>
                    ) : (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr className="border-b">
                                <th className="px-4 py-3 text-left text-sm font-medium">Produto</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Categoria</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Preço</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Cadastrado em</th>
                                <th className="px-4 py-3 text-center text-sm font-medium">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.map((product) => (
                                <tr key={product.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                        {product.featured_image_url ? (
                                          <img
                                            src={product.featured_image_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <Eye className="h-5 w-5" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-medium truncate">{product.title}</p>
                                        {product.brand && (
                                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge variant="secondary" className="text-xs">
                                      {product.category?.[0] || 'Sem categoria'}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div>
                                      {product.discounted_price ? (
                                        <>
                                          <p className="text-xs text-muted-foreground line-through">
                                            R$ {product.price?.toFixed(2)}
                                          </p>
                                          <p className="font-medium text-green-600">
                                            R$ {product.discounted_price.toFixed(2)}
                                          </p>
                                        </>
                                      ) : (
                                        <p className="font-medium">
                                          R$ {(product.price || 0).toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge
                                      variant={product.status === 'disponivel' ? 'default' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {product.status === 'disponivel' ? 'Disponível' :
                                       product.status === 'vendido' ? 'Vendido' : 'Reservado'}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {format(new Date(product.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex justify-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          if (user.slug) {
                                            window.open(`/${user.slug}/produto/${product.id}`, '_blank');
                                          }
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assinatura" className="mt-6">
              <div className="space-y-6">
                {subscriptionLoading ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <SubscriptionManagement
                    subscription={subscription}
                    userId={userId}
                    userName={user?.name || 'Usuário'}
                    onSubscriptionUpdate={refetchSubscription}
                  />
                )}

                {recentPayments.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Histórico de Pagamentos</h3>
                          <p className="text-sm text-muted-foreground">
                            Últimos {recentPayments.length} pagamentos registrados
                          </p>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-muted/50">
                                <tr className="border-b">
                                  <th className="px-4 py-3 text-left text-sm font-medium">Data</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium">Valor</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium">Método</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                  <th className="px-4 py-3 text-left text-sm font-medium">Observações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentPayments.map((payment) => (
                                  <tr key={payment.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                    <td className="px-4 py-3 text-sm">
                                      {format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: ptBR })}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">
                                          R$ {payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <Badge variant="outline" className="text-xs">
                                        {payment.payment_method}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                      <Badge
                                        variant={payment.status === 'completed' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {payment.status === 'completed' ? 'Concluído' :
                                         payment.status === 'pending' ? 'Pendente' :
                                         payment.status === 'failed' ? 'Falhou' : 'Reembolsado'}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                      {payment.notes || '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="indicacoes" className="mt-6">
              <UserReferralsTab userId={id!} referralCode={user?.referral_code} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function UserReferralsTab({ userId, referralCode }: { userId: string; referralCode?: string }) {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0 });

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('referral_commissions')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      const commissionsData = data || [];
      const referredIds = commissionsData.map(c => c.referred_user_id);

      let usersMap = new Map<string, { name: string; email: string }>();
      if (referredIds.length > 0) {
        const { data: usersData } = await supabase.from('users').select('id, name, email').in('id', referredIds);
        for (const u of usersData || []) usersMap.set(u.id, { name: u.name, email: u.email });
      }

      const enriched = commissionsData.map(c => ({
        ...c,
        referred_name: usersMap.get(c.referred_user_id)?.name || 'Desconhecido',
        referred_email: usersMap.get(c.referred_user_id)?.email || '',
      }));

      setCommissions(enriched);
      setStats({
        total: enriched.length,
        pending: enriched.filter(c => c.status === 'pending').reduce((s: number, c: any) => s + c.amount, 0),
        paid: enriched.filter(c => c.status === 'paid').reduce((s: number, c: any) => s + c.amount, 0),
      });
    } catch (error) {
      console.error('Error fetching user referrals:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  const referralLink = referralCode ? `${window.location.origin}/register?ref=${referralCode}` : null;

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      toast.success('Link copiado');
    }
  };

  if (loading) {
    return (
      <Card><CardContent className="py-12 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></CardContent></Card>
    );
  }

  return (
    <div className="space-y-4">
      {referralLink && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Link de Indicacao</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-3 py-2 rounded truncate">{referralLink}</code>
              <Button variant="outline" size="sm" onClick={handleCopyLink}><Copy className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-muted-foreground">Indicacoes</p>
            <p className="text-xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-muted-foreground">Pendente</p>
            <p className="text-xl font-bold mt-1 text-amber-600">R$ {stats.pending.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-muted-foreground">Pago</p>
            <p className="text-xl font-bold mt-1 text-green-600">R$ {stats.paid.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2"><Gift className="h-4 w-4" /> Usuarios Indicados</CardTitle>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma indicacao realizada</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicado</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Comissao</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{c.referred_name}</p>
                          <p className="text-xs text-muted-foreground">{c.referred_email}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{c.plan_type}</Badge></TableCell>
                      <TableCell className="font-medium">R$ {c.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {c.status === 'pending'
                          ? <Badge variant="outline" className="text-xs border-amber-300 text-amber-600">Pendente</Badge>
                          : <Badge className="bg-green-500 text-xs">Pago</Badge>}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(c.created_at), 'dd/MM/yy', { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
