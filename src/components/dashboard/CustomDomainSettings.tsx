import { useState, useEffect } from 'react';
import { Globe, CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle, Copy, RefreshCw, Trash2, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { CustomDomain } from '@/types';

export function CustomDomainSettings() {
  const { user } = useAuth();
  const [domain, setDomain] = useState('');
  const [domainRecord, setDomainRecord] = useState<CustomDomain | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [instructions, setInstructions] = useState<{
    cname_host: string;
    cname_value: string;
    txt_host: string;
    txt_value: string;
  } | null>(null);

  const isEligible = user?.plan_status === 'active' && user?.billing_cycle === 'annually';

  useEffect(() => {
    fetchDomainStatus();
  }, []);

  const fetchDomainStatus = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-custom-domain/status`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDomainRecord(data.domain || null);
        if (data.domain) {
          setDomain(data.domain.domain);
          if (data.domain.status === 'pending_dns') {
            const baseDomain = data.domain.domain.replace(/^www\./, '');
            setInstructions({
              cname_host: data.domain.domain.startsWith('www.') ? 'www' : data.domain.domain.split('.')[0],
              cname_value: 'vitrineturbo.netlify.app',
              txt_host: `_vitrineturbo-verify.${baseDomain}`,
              txt_value: data.domain.verification_token,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching domain status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!domain.trim()) {
      toast.error('Insira um dominio valido');
      return;
    }

    setActionLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-custom-domain/register`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain: domain.trim().toLowerCase() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Erro ao registrar dominio');
        return;
      }

      setDomainRecord(data.domain);
      setInstructions(data.instructions);
      toast.success('Dominio registrado! Configure o DNS conforme as instrucoes abaixo.');
    } catch (error) {
      toast.error('Erro ao registrar dominio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyDns = async () => {
    setActionLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-custom-domain/verify-dns`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success && data.domain?.status === 'dns_verified') {
        setDomainRecord(data.domain);
        toast.success('DNS verificado com sucesso! Ativando dominio...');
        await handleActivate();
      } else {
        setDomainRecord(data.domain || domainRecord);
        toast.error(data.message || 'DNS ainda nao verificado');
      }
    } catch (error) {
      toast.error('Erro ao verificar DNS');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    setActionLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-custom-domain/activate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDomainRecord(data.domain);
        setInstructions(null);
        toast.success('Dominio ativado com sucesso!');
      } else {
        toast.error(data.error || 'Erro ao ativar dominio');
      }
    } catch (error) {
      toast.error('Erro ao ativar dominio');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Tem certeza que deseja remover o dominio personalizado?')) return;

    setActionLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-custom-domain/remove`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDomainRecord(null);
        setDomain('');
        setInstructions(null);
        toast.success('Dominio removido com sucesso');
      } else {
        toast.error(data.error || 'Erro ao remover dominio');
      }
    } catch (error) {
      toast.error('Erro ao remover dominio');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Ativo</Badge>;
      case 'dns_verified':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><CheckCircle2 className="w-3 h-3 mr-1" /> DNS Verificado</Badge>;
      case 'pending_dns':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Aguardando DNS</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" /> Erro</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Dominio Personalizado</h3>
            <p className="text-sm text-muted-foreground">Use seu proprio dominio na sua vitrine</p>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Lock className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h4 className="text-lg font-medium mb-2">Recurso exclusivo do Plano Anual</h4>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              O dominio personalizado esta disponivel apenas para assinantes do plano anual.
              Faca upgrade para usar seu proprio dominio na sua vitrine.
            </p>
            <Badge variant="outline" className="text-sm py-1.5 px-4">
              Disponivel no Plano Anual
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Dominio Personalizado</h3>
          <p className="text-sm text-muted-foreground">Use seu proprio dominio na sua vitrine</p>
        </div>
      </div>

      {/* Current domain info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Dominio padrao</Label>
              <p className="text-sm font-medium mt-1">
                vitrineturbo.com/{user?.slug || '...'}
              </p>
            </div>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">Sempre ativo</Badge>
          </div>

          {domainRecord?.status === 'active' && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Dominio personalizado</Label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-medium">{domainRecord.domain}</p>
                  {getStatusBadge(domainRecord.status)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://${domainRecord.domain}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={actionLoading}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain configuration */}
      {!domainRecord && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label htmlFor="custom-domain">Seu dominio</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Insira o dominio que deseja usar (ex: www.minhaloja.com.br)
              </p>
              <div className="flex gap-2">
                <Input
                  id="custom-domain"
                  placeholder="www.seudominio.com.br"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={actionLoading}
                />
                <Button onClick={handleRegister} disabled={actionLoading || !domain.trim()}>
                  {actionLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Configurar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending DNS - Instructions */}
      {domainRecord && domainRecord.status === 'pending_dns' && instructions && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-2">
              {getStatusBadge(domainRecord.status)}
              <span className="text-sm font-medium">Configure o DNS do seu dominio</span>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Acesse o painel de controle do seu provedor de dominio (Registro.br, GoDaddy, Cloudflare, etc.)
                e adicione os registros abaixo.
              </AlertDescription>
            </Alert>

            {/* CNAME Record */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">1. Registro CNAME (ou A para dominio apex)</Label>
              <div className="bg-white border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Tipo:</span>
                    <span className="ml-2 text-sm font-mono">CNAME</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Host:</span>
                    <span className="ml-2 text-sm font-mono">{instructions.cname_host}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(instructions.cname_host)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">Valor:</span>
                    <span className="ml-2 text-sm font-mono">{instructions.cname_value}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(instructions.cname_value)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Para dominio sem www (apex): use registro A apontando para 75.2.60.5
              </p>
            </div>

            {/* TXT Record */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">2. Registro TXT (verificacao)</Label>
              <div className="bg-white border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Tipo:</span>
                    <span className="ml-2 text-sm font-mono">TXT</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground">Host:</span>
                    <span className="ml-2 text-sm font-mono break-all">{instructions.txt_host}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0" onClick={() => copyToClipboard(instructions.txt_host)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground">Valor:</span>
                    <span className="ml-2 text-sm font-mono break-all">{instructions.txt_value}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0" onClick={() => copyToClipboard(instructions.txt_value)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                A propagacao DNS pode levar de alguns minutos ate 48 horas. Se voce usa Cloudflare, desative o proxy (nuvem laranja) e use "DNS Only".
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleVerifyDns} disabled={actionLoading} className="flex-1">
                {actionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Verificar DNS
              </Button>
              <Button variant="outline" onClick={handleRemove} disabled={actionLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DNS Verified - Ready to activate */}
      {domainRecord && domainRecord.status === 'dns_verified' && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              {getStatusBadge(domainRecord.status)}
              <span className="text-sm font-medium">DNS verificado - pronto para ativar</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleActivate} disabled={actionLoading} className="flex-1">
                {actionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                Ativar dominio
              </Button>
              <Button variant="outline" onClick={handleRemove} disabled={actionLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {domainRecord && domainRecord.status === 'error' && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              {getStatusBadge(domainRecord.status)}
              <span className="text-sm font-medium">Erro na ativacao</span>
            </div>
            {domainRecord.error_message && (
              <p className="text-sm text-red-600">{domainRecord.error_message}</p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleActivate} disabled={actionLoading} className="flex-1">
                {actionLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Tentar novamente
              </Button>
              <Button variant="outline" onClick={handleRemove} disabled={actionLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
