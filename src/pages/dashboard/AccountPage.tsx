import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { User, Mail, Building2, Phone, Calendar, CreditCard, Link2, Loader, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import PlanStatusBadge from '@/components/subscription/PlanStatusBadge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { getInitials } from '@/lib/utils';

const accountSchema = z.object({
  owner_name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  name: z.string().min(3, 'O nome do negócio deve ter pelo menos 3 caracteres'),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      owner_name: user?.owner_name || '',
      name: user?.name || '',
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    setIsSaving(true);
    try {
      const { error } = await updateUser({
        owner_name: data.owner_name,
        name: data.name,
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Informações atualizadas com sucesso');
    } catch {
      toast.error('Erro ao atualizar informações');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPlanLabel = (status?: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'free': return 'Gratuito';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return 'Gratuito';
    }
  };

  const getBillingLabel = (cycle?: string) => {
    switch (cycle) {
      case 'monthly': return 'Mensal';
      case 'semiannually': return 'Semestral';
      case 'annually': return 'Anual';
      default: return '-';
    }
  };

  const storeUrl = user?.slug ? `${window.location.origin}/${user.slug}` : null;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl page-title">Minha Conta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize e gerencie suas informações pessoais
        </p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-foreground/10">
                <AvatarImage src={user?.avatar_url} alt={user?.owner_name || user?.name} />
                <AvatarFallback className="text-lg font-bold bg-foreground text-background">
                  {getInitials(user?.owner_name || user?.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold">
                {user?.name || 'Usuário'}
              </h2>
              {user?.owner_name && (
                <p className="text-sm text-muted-foreground">{user.owner_name}</p>
              )}
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex justify-center sm:justify-start">
                <PlanStatusBadge status={user?.plan_status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Names */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-semibold mb-4">Informações Pessoais</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="owner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Seu Nome
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Nome do Negócio
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sua empresa ou negócio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
                  {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-semibold mb-4">Detalhes da Conta</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{user?.email || '-'}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Plano</p>
                <p className="text-sm font-medium">
                  {getPlanLabel(user?.plan_status)}
                  {user?.billing_cycle && user.plan_status === 'active' && ` - ${getBillingLabel(user.billing_cycle)}`}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="text-sm font-medium">
                  {user?.whatsapp ? `+${user.country_code || '55'} ${user.whatsapp}` : '-'}
                </p>
              </div>
            </div>

            {user?.next_payment_date && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Próximo Pagamento</p>
                    <p className="text-sm font-medium">{formatDate(user.next_payment_date)}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Membro desde</p>
                <p className="text-sm font-medium">{formatDate(user?.created_at)}</p>
              </div>
            </div>

            {storeUrl && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Link da Vitrine</p>
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline truncate block"
                    >
                      {storeUrl}
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default AccountPage