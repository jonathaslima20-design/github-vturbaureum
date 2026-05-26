import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, ChevronLeft, ChevronRight, Menu, X, Settings, Settings2, FolderTree, Gift, CircleHelp as HelpCircle, ShoppingBag, ClipboardList, CreditCard, ChevronDown, BookOpen, ArrowLeftRight, Warehouse, ChartBar as BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import Logo from '@/components/Logo';
import SubscriptionModal from '@/components/subscription/SubscriptionModal';
import PlanStatusBadge from '@/components/subscription/PlanStatusBadge';
import PlanUsageIndicator from '@/components/dashboard/PlanUsageIndicator';
import { getPendingOrderCount } from '@/lib/orderService';

export default function DashboardSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [catalogExpanded, setCatalogExpanded] = useState(false);
  const [stockExpanded, setStockExpanded] = useState(false);
  const [salesExpanded, setSalesExpanded] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isCatalogSection = location.pathname.startsWith('/dashboard/listings') || location.pathname.startsWith('/dashboard/categories');
  const isStockSection = location.pathname.startsWith('/dashboard/inventory') || location.pathname.startsWith('/dashboard/stock-movements');
  const isSalesSection = location.pathname.startsWith('/dashboard/orders') || location.pathname.startsWith('/dashboard/sales');

  useEffect(() => {
    if (isCatalogSection) setCatalogExpanded(true);
  }, [isCatalogSection]);

  useEffect(() => {
    if (isStockSection) setStockExpanded(true);
  }, [isStockSection]);

  useEffect(() => {
    if (isSalesSection) setSalesExpanded(true);
  }, [isSalesSection]);

  useEffect(() => {
    if (!user?.id) return;
    getPendingOrderCount(user.id).then(setPendingOrders);
  }, [user?.id]);

  const catalogSubItems = [
    { name: 'Produtos', href: '/dashboard/listings', icon: Package },
    { name: 'Categorias', href: '/dashboard/categories', icon: FolderTree },
  ];

  const stockSubItems = [
    { name: 'Visao Geral', href: '/dashboard/inventory', icon: BarChart3 },
    { name: 'Movimentacoes', href: '/dashboard/stock-movements', icon: ArrowLeftRight },
    { name: 'Configuracoes', href: '/dashboard/inventory/settings', icon: Settings2 },
  ];

  const salesSubItems = [
    { name: 'Pedidos', href: '/dashboard/orders', icon: ClipboardList, badge: pendingOrders },
    { name: 'Vendas Online', href: '/dashboard/sales', icon: CreditCard, comingSoon: true },
  ];

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const sidebarContent = (isMobile: boolean) => {
    const isExpanded = isMobile ? true : expanded;

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <Logo showText={isExpanded} size="sm" />
          </div>
          {isMobile ? (
            <button onClick={toggleMobileSidebar} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={toggleSidebar} className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200">
              {expanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <nav className="space-y-1">
            <NeonNavItem
              name="Dashboard"
              href="/dashboard"
              icon={LayoutDashboard}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
            <NeonGroupItem
              label="Catalogo"
              icon={BookOpen}
              isGroupActive={isCatalogSection}
              isOpen={catalogExpanded}
              onToggle={() => setCatalogExpanded(!catalogExpanded)}
              isExpanded={isExpanded}
              items={catalogSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
            />
            <NeonGroupItem
              label="Estoque"
              icon={Warehouse}
              isGroupActive={isStockSection}
              isOpen={stockExpanded}
              onToggle={() => setStockExpanded(!stockExpanded)}
              isExpanded={isExpanded}
              items={stockSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
            />
            <NeonGroupItem
              label="Vendas"
              icon={ShoppingBag}
              isGroupActive={isSalesSection}
              isOpen={salesExpanded}
              onToggle={() => setSalesExpanded(!salesExpanded)}
              isExpanded={isExpanded}
              items={salesSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
              badge={pendingOrders}
            />
            <NeonNavItem
              name="Configuracoes"
              href="/dashboard/settings"
              icon={Settings}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
            <NeonNavItem
              name="Central de Ajuda"
              href="/help"
              icon={HelpCircle}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
            <NeonNavItem
              name="Indique e Ganhe"
              href="/dashboard/referral"
              icon={Gift}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto px-3 pb-4 pt-2">
          <PlanUsageIndicator expanded={isExpanded} />
          <div className="pt-3 mt-3">
            <button
              className="flex items-center gap-3 w-full rounded-xl p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 text-left group"
              onClick={() => setShowSubscriptionModal(true)}
            >
              <Avatar className="h-8 w-8 shrink-0 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all duration-300">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">
                  {getInitials(user?.name || '')}
                </AvatarFallback>
              </Avatar>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[13px] truncate leading-tight">{user?.name}</p>
                  <div className="mt-0.5">
                    <PlanStatusBadge status={user?.plan_status} />
                  </div>
                </div>
              )}
            </button>
            <button
              onClick={() => signOut()}
              className={cn(
                "flex items-center gap-2.5 py-2 px-3 w-full text-left text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-1.5 rounded-xl text-[13px]",
                !isExpanded && "justify-center"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {isExpanded && <span>Sair</span>}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile trigger */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-3 left-4 z-50 md:hidden rounded-xl bg-zinc-900/90 backdrop-blur-md border-white/10 hover:border-emerald-500/30"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[272px] z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col",
          "bg-zinc-950/95 backdrop-blur-xl border-r border-white/[0.06] shadow-2xl shadow-emerald-500/5",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent(true)}
      </div>

      {/* Desktop sidebar - Neon Accent */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "bg-zinc-950/80 backdrop-blur-xl border-r border-white/[0.06]",
          expanded ? "w-[248px]" : "w-[64px]"
        )}
      >
        {sidebarContent(false)}
      </div>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  );
}

interface NeonNavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  end?: boolean;
  onClick?: () => void;
}

function NeonNavItem({ name, href, icon: Icon, isExpanded, end, onClick }: NeonNavItemProps) {
  const link = (
    <NavLink
      to={href}
      end={end}
      onClick={onClick}
      className={({ isActive }) => cn(
        "group relative flex flex-row items-center gap-3 py-2.5 px-3 rounded-xl text-[13px] transition-all duration-200 ease-out overflow-hidden",
        isActive
          ? "text-emerald-400 font-medium bg-emerald-500/[0.08] shadow-[inset_0_0_12px_rgba(16,185,129,0.06)]"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          )}
          <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors duration-200", isActive && "drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]")} />
          {isExpanded && <span className="whitespace-nowrap">{name}</span>}
        </>
      )}
    </NavLink>
  );

  if (!isExpanded) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs bg-zinc-900 border-white/10">{name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return link;
}

interface NeonGroupItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isGroupActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isExpanded: boolean;
  items: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number; comingSoon?: boolean }>;
  onItemClick: () => void;
  badge?: number;
}

function NeonGroupItem({ label, icon: Icon, isGroupActive, isOpen, onToggle, isExpanded, items, onItemClick, badge }: NeonGroupItemProps) {
  const trigger = (
    <button
      onClick={onToggle}
      className={cn(
        "group relative flex flex-row items-center gap-3 py-2.5 px-3 rounded-xl text-[13px] transition-all duration-200 ease-out w-full text-left overflow-hidden",
        isGroupActive
          ? "text-emerald-400 font-medium bg-emerald-500/[0.08] shadow-[inset_0_0_12px_rgba(16,185,129,0.06)]"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
      )}
    >
      {isGroupActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      )}
      <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors duration-200", isGroupActive && "drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]")} />
      {isExpanded && (
        <>
          <span className="flex-1 whitespace-nowrap">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold bg-emerald-500 text-white shadow-[0_0_6px_rgba(16,185,129,0.4)]">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          <ChevronDown className={cn(
            "h-3.5 w-3.5 transition-transform duration-200 opacity-40",
            isOpen && "rotate-180"
          )} />
        </>
      )}
    </button>
  );

  return (
    <div>
      {!isExpanded ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-zinc-900 border-white/10">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : trigger}

      {isOpen && isExpanded && (
        <div className="mt-0.5 ml-4 pl-3 border-l border-emerald-500/20 space-y-0.5 py-1">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) => cn(
                "flex flex-row items-center gap-2.5 py-2 px-2.5 rounded-lg text-[12px] transition-all duration-200 ease-out",
                isActive
                  ? "text-emerald-300 font-medium bg-emerald-500/[0.06]"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 whitespace-nowrap">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white shadow-[0_0_6px_rgba(16,185,129,0.4)]">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {item.comingSoon && (
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-3.5 opacity-40 font-normal border-zinc-700 text-zinc-500">Breve</Badge>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
