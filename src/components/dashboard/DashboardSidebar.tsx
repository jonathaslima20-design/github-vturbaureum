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
            <button onClick={toggleMobileSidebar} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={toggleSidebar} className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
              {expanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {isExpanded && <CardSectionLabel>Menu</CardSectionLabel>}
          <nav className="space-y-1.5">
            <CardNavItem
              name="Dashboard"
              href="/dashboard"
              icon={LayoutDashboard}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
          </nav>

          {isExpanded && <CardSectionLabel className="mt-6">Catalogo</CardSectionLabel>}
          {!isExpanded && <div className="my-4" />}
          <nav className="space-y-1.5">
            <CardGroupItem
              label="Catalogo"
              icon={BookOpen}
              isGroupActive={isCatalogSection}
              isOpen={catalogExpanded}
              onToggle={() => setCatalogExpanded(!catalogExpanded)}
              isExpanded={isExpanded}
              items={catalogSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
            />
            <CardGroupItem
              label="Estoque"
              icon={Warehouse}
              isGroupActive={isStockSection}
              isOpen={stockExpanded}
              onToggle={() => setStockExpanded(!stockExpanded)}
              isExpanded={isExpanded}
              items={stockSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
            />
          </nav>

          {isExpanded && <CardSectionLabel className="mt-6">Vendas</CardSectionLabel>}
          {!isExpanded && <div className="my-4" />}
          <nav className="space-y-1.5">
            <CardGroupItem
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
          </nav>

          {isExpanded && <CardSectionLabel className="mt-6">Outros</CardSectionLabel>}
          {!isExpanded && <div className="my-4" />}
          <nav className="space-y-1.5">
            <CardNavItem
              name="Configuracoes"
              href="/dashboard/settings"
              icon={Settings}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
            <CardNavItem
              name="Central de Ajuda"
              href="/help"
              icon={HelpCircle}
              end
              isExpanded={isExpanded}
              onClick={() => isMobile && toggleMobileSidebar()}
            />
            <CardNavItem
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
              className="flex items-center gap-3 w-full rounded-xl p-2.5 border border-border/40 bg-card hover:shadow-md transition-all duration-200 text-left"
              onClick={() => setShowSubscriptionModal(true)}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-[11px] font-semibold bg-foreground text-background">
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
                "flex items-center gap-2.5 py-2 px-3 w-full text-left text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-200 mt-1.5 rounded-xl border border-transparent text-[13px]",
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
        className="fixed top-3 left-4 z-50 md:hidden rounded-xl"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[272px] z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col bg-background",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent(true)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen bg-muted/20 border-r border-border/40 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
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

function CardSectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 px-1 mb-2", className)}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60 whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-border/40" />
    </div>
  );
}

interface CardNavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  end?: boolean;
  onClick?: () => void;
}

function CardNavItem({ name, href, icon: Icon, isExpanded, end, onClick }: CardNavItemProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={href}
            end={end}
            onClick={onClick}
            className={({ isActive }) => cn(
              "flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-[13px] border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isActive
                ? "bg-foreground text-background font-medium shadow-md border-foreground/10 scale-[1.02] translate-x-0.5"
                : "bg-card border-border/40 text-muted-foreground hover:text-foreground hover:shadow-sm hover:border-border/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            )}
          >
            <Icon className="h-[17px] w-[17px] shrink-0" />
            {isExpanded && <span>{name}</span>}
          </NavLink>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right" className="text-xs">{name}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface CardGroupItemProps {
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

function CardGroupItem({ label, icon: Icon, isGroupActive, isOpen, onToggle, isExpanded, items, onItemClick, badge }: CardGroupItemProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl text-[13px] border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] w-full text-left",
                isGroupActive
                  ? "bg-foreground text-background font-medium shadow-md border-foreground/10 scale-[1.02] translate-x-0.5"
                  : "bg-card border-border/40 text-muted-foreground hover:text-foreground hover:shadow-sm hover:border-border/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              )}
            >
              <Icon className="h-[17px] w-[17px] shrink-0" />
              {isExpanded && (
                <>
                  <span className="flex-1">{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className={cn(
                      "flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      isGroupActive ? "bg-background/20 text-background" : "bg-red-500 text-white"
                    )}>
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-50",
                    isOpen && "rotate-180"
                  )} />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {isOpen && isExpanded && (
        <div className="mt-1.5 ml-3 pl-3 border-l-2 border-foreground/10 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) => cn(
                "flex items-center gap-2 py-2 px-3 rounded-lg text-[12px] border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isActive
                  ? "text-foreground font-medium bg-card border-border/60 shadow-sm"
                  : "text-muted-foreground hover:text-foreground border-transparent hover:bg-card hover:border-border/40"
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {item.comingSoon && (
                <Badge variant="outline" className="text-[8px] px-1.5 py-0 h-3.5 opacity-50 font-normal">Breve</Badge>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
