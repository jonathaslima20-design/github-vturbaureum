import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  createPixPayment,
  createCardPayment,
  getPaymentStatus,
  getPublicKey,
  type PixPaymentResult,
  type CardPaymentResult,
} from '@/lib/mpPayments';
import { formatCurrencyI18n } from '@/lib/i18n';
import { toast } from 'sonner';
import { QrCode, CreditCard, Copy, Check, Loader as Loader2, ArrowLeft, ShieldCheck, Clock, CircleCheck as CheckCircle2, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    MercadoPago: any;
    cardPaymentBrickController: any;
  }
}

function loadMercadoPagoScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.MercadoPago) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      reject(new Error('Timeout carregando SDK MercadoPago'));
    }, 10000);

    function done() {
      clearTimeout(timeout);
      resolve();
    }

    function fail(msg: string) {
      clearTimeout(timeout);
      reject(new Error(msg));
    }

    const existing = document.querySelector('script[src*="sdk.mercadopago.com"]') as HTMLScriptElement | null;
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      if (window.MercadoPago) done();
      else fail('Script carregou mas MercadoPago nao definido');
    };
    script.onerror = () => fail('Falha ao carregar script sdk.mercadopago.com');
    document.head.appendChild(script);
  });
}

type PaymentTab = 'pix' | 'card';

interface PlanInfo {
  id: string;
  name: string;
  price: number;
  duration: string;
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function PixSection({ plan, onSuccess }: { plan: PlanInfo; onSuccess: () => void }) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [doc, setDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const [pixResult, setPixResult] = useState<PixPaymentResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const startPolling = useCallback((paymentId: string) => {
    pollingRef.current = setInterval(async () => {
      try {
        const status = await getPaymentStatus(paymentId);
        if (status.status === 'approved') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setPaymentApproved(true);
          onSuccess();
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 5000);

    channelRef.current = supabase
      .channel(`mp_payment_${paymentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mp_payments',
          filter: `id=eq.${paymentId}`,
        },
        (payload) => {
          if (payload.new?.status === 'approved') {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setPaymentApproved(true);
            onSuccess();
          }
        }
      )
      .subscribe();
  }, [onSuccess]);

  const handleSubmit = async () => {
    if (!firstName || !email || !doc) {
      toast.error('Preencha todos os campos obrigatorios');
      return;
    }

    const cleanDoc = doc.replace(/\D/g, '');
    if (cleanDoc.length < 11) {
      toast.error('CPF/CNPJ invalido');
      return;
    }

    setLoading(true);
    try {
      const result = await createPixPayment({
        plan_id: plan.id,
        billing_cycle: plan.duration,
        payer: {
          email,
          first_name: firstName,
          last_name: lastName,
          doc: cleanDoc,
        },
      });
      setPixResult(result);
      startPolling(result.payment_id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (pixResult?.pix_qr_code) {
      navigator.clipboard.writeText(pixResult.pix_qr_code);
      setCopied(true);
      toast.success('Codigo PIX copiado!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (paymentApproved) {
    return <PaymentSuccess />;
  }

  if (pixResult) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <QrCode className="h-7 w-7 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">QR Code gerado!</h3>
          <p className="text-sm text-muted-foreground">
            Escaneie o QR Code ou copie o codigo para pagar
          </p>
        </div>

        {pixResult.pix_qr_code_base64 && (
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border">
              <img
                src={`data:image/png;base64,${pixResult.pix_qr_code_base64}`}
                alt="QR Code PIX"
                className="w-48 h-48"
              />
            </div>
          </div>
        )}

        {pixResult.pix_qr_code && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Codigo Pix (copia e cola)</Label>
            <div className="flex gap-2">
              <Input
                value={pixResult.pix_qr_code}
                readOnly
                className="text-xs font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Aguardando confirmacao do pagamento...</span>
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Apos o pagamento, seu plano sera ativado automaticamente em poucos segundos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nome"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Sobrenome"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="doc">CPF/CNPJ *</Label>
        <Input
          id="doc"
          value={doc}
          onChange={(e) => setDoc(formatCpf(e.target.value))}
          placeholder="000.000.000-00"
          maxLength={18}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <QrCode className="h-4 w-4 mr-2" />
        )}
        Gerar QR Code Pix
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        O pagamento via Pix e confirmado instantaneamente
      </p>
    </div>
  );
}

interface CardSectionProps {
  plan: PlanInfo;
  publicKey: string;
  onSuccess: () => void;
  onRetry: () => void;
}

function CardSection({ plan, publicKey, onSuccess, onRetry }: CardSectionProps) {
  const [formReady, setFormReady] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<CardPaymentResult | null>(null);
  const cardFormRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const onSuccessRef = useRef(onSuccess);
  const planRef = useRef(plan);
  onSuccessRef.current = onSuccess;
  planRef.current = plan;

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function initCardForm() {
      try {
        await loadMercadoPagoScript();
        if (cancelled) return;

        if (!window.MercadoPago) {
          throw new Error('SDK MercadoPago nao disponivel');
        }

        const mp = new window.MercadoPago(publicKey, { locale: 'pt-BR' });

        const cardForm = mp.cardForm({
          amount: String(planRef.current.price),
          iframe: true,
          form: {
            id: 'mp-card-form',
            cardNumber: { id: 'mp-card-number', placeholder: '0000 0000 0000 0000' },
            expirationDate: { id: 'mp-expiration-date', placeholder: 'MM/AA' },
            securityCode: { id: 'mp-security-code', placeholder: 'CVV' },
            cardholderName: { id: 'mp-cardholder-name', placeholder: 'Nome impresso no cartao' },
            issuer: { id: 'mp-issuer' },
            installments: { id: 'mp-installments' },
            identificationType: { id: 'mp-doc-type' },
            identificationNumber: { id: 'mp-doc-number', placeholder: 'CPF' },
            cardholderEmail: { id: 'mp-email', placeholder: 'E-mail' },
          },
          callbacks: {
            onFormMounted: (error: any) => {
              if (cancelled) return;
              if (error) {
                console.error('CardForm mount error:', error);
                setFormError(error.message || 'Erro ao montar formulario');
              } else {
                setFormReady(true);
              }
            },
            onSubmit: (event: Event) => {
              event.preventDefault();
              if (!mountedRef.current) return;

              const formData = cardForm.getCardFormData();
              setProcessing(true);

              createCardPayment({
                plan_id: planRef.current.id,
                billing_cycle: planRef.current.duration,
                token: formData.token,
                installments: Number(formData.installments),
                payment_method_id: formData.paymentMethodId,
                issuer_id: formData.issuerId || '',
                payer: {
                  email: formData.cardholderEmail || '',
                  doc: formData.identificationNumber || '',
                },
              }).then((cardResult) => {
                if (!mountedRef.current) return;
                setResult(cardResult);
                if (cardResult.status === 'approved') {
                  onSuccessRef.current();
                }
              }).catch((error) => {
                if (!mountedRef.current) return;
                toast.error(error instanceof Error ? error.message : 'Erro ao processar pagamento');
              }).finally(() => {
                if (mountedRef.current) setProcessing(false);
              });
            },
            onFetching: (resource: string) => {
              const progressBar = document.getElementById('mp-progress');
              if (progressBar) progressBar.style.display = 'block';
              return () => {
                if (progressBar) progressBar.style.display = 'none';
              };
            },
            onCardTokenReceived: (error: any, token: any) => {
              if (error) {
                console.error('Token error:', error);
                if (mountedRef.current) {
                  toast.error('Erro ao processar dados do cartao');
                  setProcessing(false);
                }
              }
            },
            onError: (error: any) => {
              console.error('CardForm error:', error);
            },
          },
        });

        cardFormRef.current = cardForm;
      } catch (error) {
        console.error('CardForm init failed:', error);
        if (!cancelled && mountedRef.current) {
          setFormError(error instanceof Error ? error.message : 'Erro ao inicializar formulario');
        }
      }
    }

    initCardForm();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      if (cardFormRef.current) {
        try { cardFormRef.current.unmount(); } catch {}
        cardFormRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  if (result) {
    if (result.status === 'approved') {
      return <PaymentSuccess />;
    }

    if (result.status === 'in_process') {
      return (
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-amber-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">Pagamento em analise</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Seu pagamento esta sendo processado. Voce sera notificado assim que for aprovado.
          </p>
          <Badge variant="outline" className="text-amber-600">
            {result.card_last4 && `Cartao ****${result.card_last4}`}
          </Badge>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="h-7 w-7 text-red-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Pagamento recusado</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {result.status_detail || 'Verifique os dados do cartao e tente novamente.'}
        </p>
        <Button variant="outline" onClick={() => setResult(null)}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (formError) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-red-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">Erro ao carregar formulario</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Nao foi possivel carregar o formulario de pagamento. Tente novamente.
        </p>
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div id="mp-progress" className="hidden">
        <div className="h-1 w-full bg-muted rounded overflow-hidden">
          <div className="h-full bg-primary animate-pulse w-full" />
        </div>
      </div>

      <form id="mp-card-form" className="space-y-4">
        <div className="space-y-2">
          <Label>Numero do cartao</Label>
          <div id="mp-card-number" className="h-10 border rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Validade</Label>
            <div id="mp-expiration-date" className="h-10 border rounded-md" />
          </div>
          <div className="space-y-2">
            <Label>CVV</Label>
            <div id="mp-security-code" className="h-10 border rounded-md" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mp-cardholder-name">Nome no cartao</Label>
          <Input id="mp-cardholder-name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mp-email">E-mail</Label>
          <Input id="mp-email" type="email" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mp-doc-type">Tipo doc.</Label>
            <select id="mp-doc-type" className="w-full h-10 border rounded-md px-3 bg-background text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mp-doc-number">Documento</Label>
            <Input id="mp-doc-number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mp-issuer">Banco emissor</Label>
          <select id="mp-issuer" className="w-full h-10 border rounded-md px-3 bg-background text-sm" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mp-installments">Parcelas</Label>
          <select id="mp-installments" className="w-full h-10 border rounded-md px-3 bg-background text-sm" />
        </div>

        <Button type="submit" disabled={processing || !formReady} className="w-full" size="lg">
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pagar {formatCurrencyI18n(plan.price)}
            </>
          )}
        </Button>
      </form>

      {!formReady && !formError && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando formulario seguro...</span>
        </div>
      )}
    </div>
  );
}

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4 py-8">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold">Pagamento aprovado!</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Seu plano foi ativado com sucesso. Aproveite todos os recursos da plataforma!
      </p>
      <Button onClick={() => navigate('/dashboard')} size="lg">
        Ir para o Dashboard
      </Button>
    </div>
  );
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PaymentTab>('pix');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [sdkError, setSdkError] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  const planId = searchParams.get('plan');
  const cycle = searchParams.get('cycle');

  useEffect(() => {
    if (!planId) {
      navigate('/dashboard/settings');
      return;
    }

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('id, name, price, duration')
        .eq('id', planId)
        .maybeSingle();

      if (error || !data) {
        toast.error('Plano nao encontrado');
        navigate('/dashboard/settings');
        return;
      }

      setPlan({
        id: data.id,
        name: data.name,
        price: Number(data.price),
        duration: cycle || data.duration,
      });
      setPlanLoading(false);
    };

    fetchPlan();
  }, [planId, cycle, navigate]);

  const fetchPublicKey = useCallback(async () => {
    setSdkError(false);
    setPublicKey(null);
    try {
      const info = await getPublicKey();
      if (!info.public_key) {
        throw new Error('Chave publica nao configurada');
      }
      setPublicKey(info.public_key);
    } catch (error) {
      console.error('MercadoPago public key fetch failed:', error);
      setSdkError(true);
    }
  }, []);

  useEffect(() => {
    fetchPublicKey();
  }, [fetchPublicKey]);

  const handleRetry = useCallback(() => {
    setCardKey(k => k + 1);
    fetchPublicKey();
  }, [fetchPublicKey]);

  const handleSuccess = useCallback(() => {
    setPaymentComplete(true);
  }, []);

  if (planLoading || !plan) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const renderCardContent = () => {
    if (sdkError) {
      return (
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">Erro ao carregar formulario</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Nao foi possivel inicializar o sistema de pagamento. Verifique sua conexao.
          </p>
          <Button variant="outline" onClick={handleRetry}>
            Tentar novamente
          </Button>
        </div>
      );
    }

    if (!publicKey) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    return (
      <CardSection
        key={cardKey}
        plan={plan}
        publicKey={publicKey}
        onSuccess={handleSuccess}
        onRetry={handleRetry}
      />
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{plan.name}</p>
                <p className="text-sm text-muted-foreground">Ciclo: {plan.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {formatCurrencyI18n(plan.price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {paymentComplete ? (
          <Card>
            <CardContent className="p-6">
              <PaymentSuccess />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Forma de pagamento</CardTitle>
              <CardDescription>Escolha como deseja pagar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('pix')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
                    activeTab === 'pix'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-muted hover:border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  <QrCode className="h-4 w-4" />
                  <span className="text-sm font-medium">Pix</span>
                </button>
                <button
                  onClick={() => setActiveTab('card')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
                    activeTab === 'card'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-muted hover:border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-medium">Cartao</span>
                </button>
              </div>

              <Separator />

              {activeTab === 'pix' ? (
                <PixSection plan={plan} onSuccess={handleSuccess} />
              ) : (
                renderCardContent()
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Pagamento seguro processado por Mercado Pago</span>
        </div>
      </div>
    </div>
  );
}
