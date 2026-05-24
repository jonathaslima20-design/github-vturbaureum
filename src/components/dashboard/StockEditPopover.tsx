import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TriangleAlert as AlertTriangle, Package } from 'lucide-react';
import { updateProductStock } from '@/lib/stockUtils';
import { getStockStatus, type StockStatus } from '@/lib/stockUtils';
import { toast } from 'sonner';

interface StockEditPopoverProps {
  productId: string;
  stockQuantity: number | null;
  lowStockThreshold: number;
  trackInventory: boolean;
  onStockUpdated: (productId: string, newQuantity: number) => void;
}

export function StockEditPopover({
  productId,
  stockQuantity,
  lowStockThreshold,
  trackInventory,
  onStockUpdated,
}: StockEditPopoverProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(stockQuantity ?? 0));
  const [saving, setSaving] = useState(false);

  if (!trackInventory) return null;

  const status = getStockStatus({ track_inventory: true, stock_quantity: stockQuantity, low_stock_threshold: lowStockThreshold });

  const badgeConfig: Record<StockStatus, { label: string; className: string }> = {
    in_stock: {
      label: `${stockQuantity} un.`,
      className: 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent',
    },
    low_stock: {
      label: `${stockQuantity} un.`,
      className: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-transparent',
    },
    out_of_stock: {
      label: 'Esgotado',
      className: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-transparent',
    },
    untracked: { label: '', className: '' },
  };

  const config = badgeConfig[status];

  const handleSave = async () => {
    const newQuantity = Math.max(0, parseInt(value) || 0);
    setSaving(true);
    const success = await updateProductStock(productId, newQuantity);
    if (success) {
      onStockUpdated(productId, newQuantity);
      toast.success('Estoque atualizado');
      setOpen(false);
    } else {
      toast.error('Erro ao atualizar estoque');
    }
    setSaving(false);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setValue(String(stockQuantity ?? 0));
    }}>
      <PopoverTrigger asChild onClick={(e) => e.preventDefault()}>
        <Badge
          className={`cursor-pointer text-[10px] px-1.5 py-0 ${config.className}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {status === 'low_stock' && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
          {config.label}
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        className="w-52 p-3"
        align="end"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Quantidade em estoque</p>
          <Input
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
          <Button
            size="sm"
            className="w-full h-7 text-xs"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
