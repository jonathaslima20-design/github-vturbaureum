import { Package, FolderOpen, CircleArrowUp as ArrowUpCircle } from 'lucide-react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useSubscriptionModal } from '@/contexts/SubscriptionModalContext';

interface PlanUsageIndicatorProps {
  expanded?: boolean;
}

export default function PlanUsageIndicator({ expanded = true }: PlanUsageIndicatorProps) {
  const { isFreePlan, productCount, productLimit, categoryCount, categoryLimit, loading } = usePlanLimits();
  const { openModal } = useSubscriptionModal();

  if (!isFreePlan || loading) return null;

  const productPct = productLimit ? Math.min((productCount / productLimit) * 100, 100) : 0;
  const categoryPct = categoryLimit ? Math.min((categoryCount / categoryLimit) * 100, 100) : 0;

  const barColor = (pct: number) => {
    if (pct >= 100) return 'bg-red-500';
    if (pct >= 70) return 'bg-amber-400';
    return 'bg-blue-400';
  };

  if (!expanded) {
    return (
      <button
        onClick={() => openModal(false)}
        className="w-full flex justify-center py-2 rounded-md hover:bg-muted/60 transition-colors group"
        title="Plano Free — ver limites"
      >
        <ArrowUpCircle className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
    );
  }

  return (
    <div className="px-3 pb-3">
      <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plano Free</span>
          <button
            onClick={() => openModal(false)}
            className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
          >
            <ArrowUpCircle className="h-3 w-3" />
            Upgrade
          </button>
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-3 w-3" />
                Produtos
              </span>
              <span className={`font-medium ${productPct >= 100 ? 'text-red-600' : productPct >= 70 ? 'text-amber-600' : 'text-foreground'}`}>
                {productCount}/{productLimit}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(productPct)}`}
                style={{ width: `${productPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <FolderOpen className="h-3 w-3" />
                Categorias
              </span>
              <span className={`font-medium ${categoryPct >= 100 ? 'text-red-600' : categoryPct >= 70 ? 'text-amber-600' : 'text-foreground'}`}>
                {categoryCount}/{categoryLimit}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(categoryPct)}`}
                style={{ width: `${categoryPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
