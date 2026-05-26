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
    { name: 'Visão Geral', href: '/dashboard/inventory', icon: BarChart3 },
    { name: 'Movimentações', href: '/dashboard/stock-movements', icon: ArrowLeftRight },
    { name: 'Configurações', href: '/dashboard/inventory/settings', icon: Settings2 },
  ];

  const salesSubItems = [
    { name: 'Pedidos', href: '/dashboard/orders', icon: ClipboardList, badge: pendingOrders },
    { name: 'Vendas Online', href: '/dashboard/sales', icon: CreditCard, comingSoon: true },
  ];

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const sidebarContent = (isDesktop: boolean) => {
    const isExpanded = isDesktop ? expanded : true;

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Logo showText={false} size="sm" />
            {isExpanded && (
              <span className="font-semibold text-sm tracking-tight">Painel</span>
            )}
          </div>

          {!isDesktop ? (
            <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {/* Menu section */}
          {isExpanded && <SectionLabel>Menu</SectionLabel>}
          <nav className="space-y-0.5">
            <SidebarNavItem
              name="Dashboard"
              href="/dashboard"
              icon={LayoutDashboard}
              end
              isExpanded={isExpanded}
              onClick={() => !isDesktop && toggleMobileSidebar()}
            />
          </nav>

          {/* Catalog section */}
          {isExpanded && <SectionLabel className="mt-5">Catálogo</SectionLabel>}
          {!isExpanded && <div className="my-3 mx-2 border-t border-border" />}
          <nav className="space-y-0.5">
            <SidebarGroupItem
              label="Catálogo"
              icon={BookOpen}
              isGroupActive={isCatalogSection}
              isOpen={catalogExpanded}
              onToggle={() => setCatalogExpanded(!catalogExpanded)}
              isExpanded={isExpanded}
              items={catalogSubItems}
              onItemClick={() => !isDesktop && toggleMobileSidebar()}
            />

            <SidebarGroupItem
              label="Estoque"
              icon={Warehouse}
              isGroupActive={isStockSection}
              isOpen={stockExpanded}
              onToggle={() => setStockExpanded(!stockExpanded)}
              isExpanded={isExpanded}
              items={stockSubItems}
              onItemClick={() => !isDesktop && toggleMobileSidebar()}
            />
          </nav>

          {/* Sales section */}
          {isExpanded && <SectionLabel className="mt-5">Vendas</SectionLabel>}
          {!isExpanded && <div className="my-3 mx-2 border-t border-border" />}
          <nav className="space-y-0.5">
            <SidebarGroupItem
              label="Vendas"
              icon={ShoppingBag}
              isGroupActive={isSalesSection}
              isOpen={salesExpanded}
              onToggle={() => setSalesExpanded(!salesExpanded)}
              isExpanded={isExpanded}
              items={salesSubItems}
              onItemClick={() => !isDesktop && toggleMobileSidebar()}
              badge={pendingOrders}
            />
          </nav>

          {/* Others section */}
          {isExpanded && <SectionLabel className="mt-5">Outros</SectionLabel>}
          {!isExpanded && <div className="my-3 mx-2 border-t border-border" />}
          <nav className="space-y-0.5">
            <SidebarNavItem
              name="Configurações"
              href="/dashboard/settings"
              icon={Settings}
              isExpanded={isExpanded}
              onClick={() => !isDesktop && toggleMobileSidebar()}
            />
            <SidebarNavItem
              name="Central de Ajuda"
              href="/help"
              icon={HelpCircle}
              isExpanded={isExpanded}
              onClick={() => !isDesktop && toggleMobileSidebar()}
            />
            <SidebarNavItem
              name="Indique e Ganhe"
              href="/dashboard/referral"
              icon={Gift}
              isExpanded={isExpanded}
              onClick={() => !isDesktop && toggleMobileSidebar()}
            />
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto px-3 pb-3">
          <PlanUsageIndicator expanded={isExpanded} />

          <div className="border-t border-border pt-3 mt-2">
            <button
              className="flex items-center gap-2.5 w-full rounded-lg p-2 hover:bg-muted/80 transition-colors text-left"
              onClick={() => setShowSubscriptionModal(true)}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-[11px] font-medium">{getInitials(user?.name || '')}</AvatarFallback>
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
                "flex items-center gap-2.5 py-2 px-2 w-full text-left text-muted-foreground hover:text-destructive transition-colors mt-1 rounded-lg text-[13px]",
                !isExpanded && "justify-center"
              )}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
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
        className="fixed top-3 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[260px] bg-background border-r z-50 transition-transform duration-300 md:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen border-r bg-background transition-all duration-300",
          expanded ? "w-60" : "w-16"
        )}
      >
        {sidebarContent(true)}
      </div>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  );
}

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-1.5", className)}>
      {children}
    </p>
  );
}

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  end?: boolean;
  onClick?: () => void;
}

function SidebarNavItem({ name, href, icon: Icon, isExpanded, end, onClick }: SidebarNavItemProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={href}
            end={end}
            onClick={onClick}
            className={({ isActive }) => cn(
              "relative flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-150",
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary -ml-3" />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {isExpanded && <span>{name}</span>}
              </>
            )}
          </NavLink>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right" className="text-xs font-medium">{name}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface SidebarGroupItemProps {
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

function SidebarGroupItem({ label, icon: Icon, isGroupActive, isOpen, onToggle, isExpanded, items, onItemClick, badge }: SidebarGroupItemProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "relative flex items-center gap-2.5 py-2 px-3 rounded-lg text-[13px] font-medium transition-all duration-150 w-full text-left",
                isGroupActive
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {isGroupActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary -ml-3" />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
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
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 opacity-60", isOpen && "rotate-180")} />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="text-xs font-medium">{label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {isOpen && isExpanded && (
        <div className="mt-0.5 ml-[18px] pl-3 border-l border-border/60 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) => cn(
                "flex items-center gap-2 py-1.5 px-2.5 rounded-md text-[12px] transition-all duration-150",
                isActive
                  ? "text-foreground font-medium bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {item.comingSoon && (
                <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 opacity-50 font-normal">Breve</Badge>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
