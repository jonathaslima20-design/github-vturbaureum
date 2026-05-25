import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Save, RotateCcw, ChevronDown, Lock, Palette, Type, Square, Sparkles, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { useStorefrontAppearance } from '@/hooks/useStorefrontAppearance';
import { useMockupData } from '@/hooks/useMockupData';
import { PhoneMockup } from '@/components/dashboard/PhoneMockup';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DEFAULT_APPEARANCE,
  FONT_OPTIONS,
  HEADING_FONT_OPTIONS,
  BORDER_RADIUS_OPTIONS,
  SHADOW_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  SPACING_OPTIONS,
  loadGoogleFont,
  type StorefrontAppearance,
} from '@/lib/appearanceDefaults';

export function AppearanceSettings() {
  const { user } = useAuth();
  const { appearance, loading, save } = useStorefrontAppearance(user?.id);
  const mockupData = useMockupData();
  const [localAppearance, setLocalAppearance] = useState<StorefrontAppearance>(DEFAULT_APPEARANCE);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isFreePlan = user?.plan_status === 'free';

  useEffect(() => {
    if (!loading) {
      setLocalAppearance(appearance);
    }
  }, [loading, appearance]);

  const updateField = <K extends keyof StorefrontAppearance>(field: K, value: StorefrontAppearance[K]) => {
    setLocalAppearance(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorPicker label="Fundo da pagina" value={localAppearance.bg_color} onChange={(v) => updateField('bg_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Texto principal" value={localAppearance.text_color} onChange={(v) => updateField('text_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Titulos" value={localAppearance.heading_color} onChange={(v) => updateField('heading_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Texto secundario" value={localAppearance.muted_text_color} onChange={(v) => updateField('muted_text_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Bordas" value={localAppearance.border_color} onChange={(v) => updateField('border_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Fundo dos cards" value={localAppearance.card_bg_color} onChange={(v) => updateField('card_bg_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Borda dos cards" value={localAppearance.card_border_color} onChange={(v) => updateField('card_border_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Botoes (fundo)" value={localAppearance.button_bg_color} onChange={(v) => updateField('button_bg_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Botoes (texto)" value={localAppearance.button_text_color} onChange={(v) => updateField('button_text_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Badges (fundo)" value={localAppearance.badge_bg_color} onChange={(v) => updateField('badge_bg_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Badges (texto)" value={localAppearance.badge_text_color} onChange={(v) => updateField('badge_text_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Icones" value={localAppearance.icon_color} onChange={(v) => updateField('icon_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Cor de destaque" value={localAppearance.accent_color} onChange={(v) => updateField('accent_color', v)} disabled={isFreePlan} />
            <ColorPicker label="Overlay da capa" value={localAppearance.cover_overlay_color || '#000000'} onChange={(v) => updateField('cover_overlay_color', v)} disabled={isFreePlan} />
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
                disabled={isFreePlan}
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
                disabled={isFreePlan}
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
                    disabled={isFreePlan}
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

        {/* Borders & Shadows Section */}
        <CollapsibleSection
          icon={<Square size={16} />}
          title="Bordas e Sombras"
        >
          <div className="space-y-4">
            <SelectField
              label="Arredondamento dos cards"
              value={localAppearance.card_border_radius}
              options={BORDER_RADIUS_OPTIONS}
              onChange={(v) => updateField('card_border_radius', v as StorefrontAppearance['card_border_radius'])}
              disabled={isFreePlan}
            />
            <SelectField
              label="Arredondamento dos botoes"
              value={localAppearance.button_border_radius}
              options={BORDER_RADIUS_OPTIONS}
              onChange={(v) => updateField('button_border_radius', v as StorefrontAppearance['button_border_radius'])}
              disabled={isFreePlan}
            />
            <SelectField
              label="Arredondamento das imagens"
              value={localAppearance.image_border_radius}
              options={BORDER_RADIUS_OPTIONS}
              onChange={(v) => updateField('image_border_radius', v as StorefrontAppearance['image_border_radius'])}
              disabled={isFreePlan}
            />
            <SelectField
              label="Arredondamento da capa"
              value={localAppearance.cover_border_radius}
              options={[
                { value: 'none', label: 'Quadrado' },
                { value: 'sm', label: 'Leve' },
                { value: 'md', label: 'Medio' },
                { value: 'lg', label: 'Grande' },
                { value: 'xl', label: 'Extra grande' },
              ]}
              onChange={(v) => updateField('cover_border_radius', v as StorefrontAppearance['cover_border_radius'])}
              disabled={isFreePlan}
            />
            <SelectField
              label="Sombra dos cards"
              value={localAppearance.card_shadow}
              options={SHADOW_OPTIONS}
              onChange={(v) => updateField('card_shadow', v as StorefrontAppearance['card_shadow'])}
              disabled={isFreePlan}
            />
          </div>
        </CollapsibleSection>

        {/* Effects Section */}
        <CollapsibleSection
          icon={<Sparkles size={16} />}
          title="Efeitos"
        >
          <SelectField
            label="Efeito hover nos cards"
            value={localAppearance.hover_effect}
            options={HOVER_EFFECT_OPTIONS}
            onChange={(v) => updateField('hover_effect', v as StorefrontAppearance['hover_effect'])}
            disabled={isFreePlan}
          />
        </CollapsibleSection>

        {/* Spacing Section */}
        <CollapsibleSection
          icon={<AlignJustify size={16} />}
          title="Espacamento"
        >
          <div className="space-y-4">
            <SelectField
              label="Espacamento entre secoes"
              value={localAppearance.section_spacing}
              options={SPACING_OPTIONS}
              onChange={(v) => updateField('section_spacing', v as StorefrontAppearance['section_spacing'])}
              disabled={isFreePlan}
            />
            <SelectField
              label="Gap entre cards"
              value={localAppearance.card_gap}
              options={SPACING_OPTIONS}
              onChange={(v) => updateField('card_gap', v as StorefrontAppearance['card_gap'])}
              disabled={isFreePlan}
            />
          </div>
        </CollapsibleSection>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-card pb-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isFreePlan}
            className="gap-2"
          >
            <RotateCcw size={14} />
            Restaurar padrao
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving || isFreePlan}
            className="gap-2 flex-1"
          >
            <Save size={14} />
            {saving ? 'Salvando...' : 'Salvar alteracoes'}
          </Button>
        </div>

        {isFreePlan && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
            <Lock size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Recurso Premium</p>
              <p className="text-xs text-amber-700 mt-1">
                Personalize sua vitrine com cores, fontes e efeitos exclusivos. Faca upgrade para desbloquear.
              </p>
            </div>
          </div>
        )}
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
        <div className="absolute z-50 mt-2 p-3 rounded-lg border bg-popover shadow-lg">
          <HexColorPicker color={value} onChange={onChange} />
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full text-xs text-center text-muted-foreground hover:text-foreground"
          >
            Fechar
          </button>
        </div>
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
