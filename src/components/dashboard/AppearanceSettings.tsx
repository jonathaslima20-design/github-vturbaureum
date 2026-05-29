import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Save, RotateCcw, ChevronDown, Lock, Palette, Type, ImageIcon, Upload, X, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useStorefrontAppearance } from '@/hooks/useStorefrontAppearance';
import { useMockupData } from '@/hooks/useMockupData';
import { PhoneMockup } from '@/components/dashboard/PhoneMockup';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { deriveColorsFromBase } from '@/utils/colorUtils';
import { uploadImage, deleteImage } from '@/lib/image';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';
import {
  DEFAULT_APPEARANCE,
  FONT_OPTIONS,
  HEADING_FONT_OPTIONS,
  loadGoogleFont,
  type StorefrontAppearance,
} from '@/lib/appearanceDefaults';

export function AppearanceSettings() {
  const { user } = useAuth();
  const { appearance, loading, save } = useStorefrontAppearance(user?.id);
  const mockupData = useMockupData();
  const { openModal } = useSubscriptionModal();
  const [localAppearance, setLocalAppearance] = useState<StorefrontAppearance>(DEFAULT_APPEARANCE);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPremiumBlock, setShowPremiumBlock] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isFreePlan = user?.plan_status === 'free' || user?.plan_status === 'expired';
  const isAnnualPlan = user?.plan_status === 'active' && user?.billing_cycle === 'annually';

  useEffect(() => {
    if (!loading) {
      setLocalAppearance(appearance);
    }
  }, [loading, appearance]);

  const updateField = <K extends keyof StorefrontAppearance>(field: K, value: StorefrontAppearance[K]) => {
    setLocalAppearance(prev => {
      const next = { ...prev, [field]: value };
      const colorFields: (keyof StorefrontAppearance)[] = ['bg_color', 'text_color', 'button_bg_color', 'accent_color', 'border_color'];
      if (colorFields.includes(field as keyof StorefrontAppearance)) {
        const derived = deriveColorsFromBase(
          next.bg_color,
          next.text_color,
          next.button_bg_color,
          next.accent_color,
          next.border_color,
        );
        return { ...next, ...derived };
      }
      return next;
    });
    setHasChanges(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const allowedTypes = ['image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato invalido. Use PNG, SVG ou WebP.');
      return;
    }
    if (file.size > 500 * 1024) {
      toast.error('Arquivo muito grande. Tamanho maximo: 500 KB.');
      return;
    }

    setLogoUploading(true);
    try {
      const url = await uploadImage(file, user.id, 'logos');
      const success = await save({ ...localAppearance, custom_logo_url: url });
      if (success) {
        setLocalAppearance(prev => ({ ...prev, custom_logo_url: url }));
        toast.success('Logo carregada com sucesso!');
      } else {
        toast.error('Erro ao salvar logo');
      }
    } catch {
      toast.error('Erro ao fazer upload da logo');
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleLogoRemove = async () => {
    if (!user?.id) return;
    const oldUrl = localAppearance.custom_logo_url;
    setLogoUploading(true);
    try {
      const success = await save({ ...localAppearance, custom_logo_url: null });
      if (success) {
        setLocalAppearance(prev => ({ ...prev, custom_logo_url: null }));
        if (oldUrl) {
          try { await deleteImage(oldUrl); } catch { /* ignore storage errors */ }
        }
        toast.success('Logo removida.');
      } else {
        toast.error('Erro ao remover logo');
      }
    } catch {
      toast.error('Erro ao remover logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSave = async () => {
    if (isFreePlan) {
      setShowPremiumBlock(true);
      return;
    }
    setSaving(true);
    const { id, user_id, ...data } = localAppearance as StorefrontAppearance & { id?: string; user_id?: string };
    const success = await save(data);
    if (success) {
      toast.success('Aparencia salva com sucesso!');
      setHasChanges(false);
    } else {
      toast.error('Erro ao salvar aparencia');
    }
    setSaving(false);
  };

  const handleReset = async () => {
    setLocalAppearance(DEFAULT_APPEARANCE);
    setHasChanges(true);
    toast.info('Aparencia restaurada para o padrao. Clique em Salvar para confirmar.');
  };

  const handleFontChange = (field: 'font_family' | 'heading_font_family', value: string) => {
    loadGoogleFont(value);
    updateField(field, value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (showPremiumBlock) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Funcionalidade Premium</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              A personalização de aparência está disponível apenas para planos pagos. Faça upgrade para aplicar cores, fontes e estilos exclusivos à sua vitrine.
            </p>
            <Button
              onClick={() => {
                const event = new CustomEvent('open-subscription-modal');
                window.dispatchEvent(event);
              }}
            >
              Fazer Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8">
      {/* Controls Panel */}
      <div className="space-y-4 order-2 lg:order-1">
        {/* Colors Section */}
        <CollapsibleSection
          icon={<Palette size={16} />}
          title="Cores"
          defaultOpen
        >
          <div className="space-y-5">
            {/* Background color */}
            <div>
              <ColorPicker
                label="Cor do fundo"
                value={localAppearance.bg_color}
                onChange={(v) => updateField('bg_color', v)}
                disabled={false}
              />

            </div>

            {/* Core colors grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPicker label="Cor do texto" value={localAppearance.text_color} onChange={(v) => updateField('text_color', v)} disabled={false} />
              <ColorPicker label="Cor dos botoes" value={localAppearance.button_bg_color} onChange={(v) => updateField('button_bg_color', v)} disabled={false} />
              <ColorPicker label="Texto dos botoes" value={localAppearance.button_text_color} onChange={(v) => updateField('button_text_color', v)} disabled={false} />
              <ColorPicker label="Cor dos icones" value={localAppearance.icon_color} onChange={(v) => updateField('icon_color', v)} disabled={false} />
              <ColorPicker label="Cor de destaque" value={localAppearance.accent_color} onChange={(v) => updateField('accent_color', v)} disabled={false} />
              <ColorPicker label="Cor das bordas" value={localAppearance.border_color} onChange={(v) => updateField('border_color', v)} disabled={false} />
            </div>
          </div>
        </CollapsibleSection>

        {/* Typography Section */}
        <CollapsibleSection
          icon={<Type size={16} />}
          title="Tipografia"
        >
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Fonte do corpo</Label>
              <Select
                value={localAppearance.font_family}
                onValueChange={(v) => handleFontChange('font_family', v)}
                disabled={false}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: `'${f.value}', sans-serif` }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Fonte dos titulos</Label>
              <Select
                value={localAppearance.heading_font_family}
                onValueChange={(v) => handleFontChange('heading_font_family', v)}
                disabled={false}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEADING_FONT_OPTIONS.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <span style={{ fontFamily: `'${f.value}', sans-serif` }}>{f.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Tamanho base</Label>
              <div className="flex gap-2">
                {(['sm', 'md', 'lg'] as const).map(size => (
                  <button
                    key={size}
                    disabled={false}
                    onClick={() => updateField('font_size_base', size)}
                    className={cn(
                      'flex-1 py-2 rounded-md border text-sm font-medium transition-all',
                      localAppearance.font_size_base === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {size === 'sm' ? 'P' : size === 'md' ? 'M' : 'G'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>


        {/* Logo Section */}
        <CollapsibleSection
          icon={<ImageIcon size={16} />}
          title="Logo personalizada"
        >
          {isAnnualPlan ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Substitui a logo do VitrineTurbo e o texto "Crie sua Vitrine Digital" no rodape da sua vitrine. Recomendamos PNG ou SVG com fundo transparente, minimo 200×60 px e ate <strong>500 KB</strong>.
              </p>

              {localAppearance.custom_logo_url ? (
                <div className="space-y-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-center min-h-[80px]">
                    <img
                      src={localAppearance.custom_logo_url}
                      alt="Logo personalizada"
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={logoUploading}
                    >
                      <Upload size={13} />
                      Trocar logo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={handleLogoRemove}
                      disabled={logoUploading}
                    >
                      <X size={13} />
                      Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-colors py-6 text-sm text-muted-foreground disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Upload size={20} className="text-muted-foreground/60" />
                  {logoUploading ? 'Enviando...' : 'Clique para carregar sua logo'}
                  <span className="text-[11px] opacity-70">PNG, SVG ou WebP — max. 500 KB</span>
                </button>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-4 flex flex-col items-center gap-3 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Crown size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Exclusivo do Plano Anual</p>
                <p className="text-xs text-muted-foreground mt-1">Faca upgrade para o plano anual e coloque sua propria marca no rodape da vitrine.</p>
              </div>
              <Button size="sm" onClick={() => openModal(false)}>
                Ver planos
              </Button>
            </div>
          )}
        </CollapsibleSection>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-card pb-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={false}
            className="gap-2"
          >
            <RotateCcw size={14} />
            Restaurar padrao
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-2 flex-1"
          >
            <Save size={14} />
            {saving ? 'Salvando...' : 'Salvar alteracoes'}
          </Button>
        </div>

      </div>

      {/* Phone Mockup (sticky on desktop) */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
        <div className="flex flex-col items-center">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Preview em tempo real</p>
          <PhoneMockup
            appearance={localAppearance}
            name={mockupData.name}
            bio={mockupData.bio}
            avatar_url={mockupData.avatar_url}
            cover_url_mobile={mockupData.cover_url_mobile}
            promotional_banner_url_mobile={mockupData.promotional_banner_url_mobile}
            whatsapp={mockupData.whatsapp}
            instagram={mockupData.instagram}
            phone={mockupData.phone}
            location={mockupData.location}
            products={mockupData.products}
            categoryName={mockupData.categoryName}
          />
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function CollapsibleSection({
  icon,
  title,
  children,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 text-sm font-medium">
            {icon}
            {title}
          </div>
          <ChevronDown
            size={16}
            className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pt-4 pb-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', disabled && 'opacity-50 pointer-events-none')}>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-md border border-border shadow-sm shrink-0 transition-transform hover:scale-105"
          style={{ backgroundColor: value }}
        />
        <Input
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v) || v === '') {
              onChange(v || '#000000');
            }
          }}
          className="h-8 text-xs font-mono"
          placeholder="#000000"
        />
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 p-3 rounded-lg border bg-popover shadow-lg">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
        </>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn(disabled && 'opacity-50 pointer-events-none')}>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
