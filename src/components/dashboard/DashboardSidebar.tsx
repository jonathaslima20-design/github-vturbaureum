import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, ChevronLeft, ChevronRight, Menu, X, Settings, Settings2, FolderTree, Gift, CircleHelp as HelpCircle, ShoppingBag, ClipboardList, CreditCard, ChevronDown, BookOpen, ArrowLeftRight, Warehouse, ChartBar as BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

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

  const bottomNavigation = [
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    { name: 'Central de Ajuda', href: '/help', icon: HelpCircle },
    { name: 'Indique e Ganhe', href: '/dashboard/referral', icon: Gift },
  ];

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const navItemClasses = ({ isActive }: { isActive: boolean }) => cn(
    "relative flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200",
    {
      "bg-muted/80 text-foreground font-medium border border-border/60 shadow-sm": isActive,
      "text-muted-foreground hover:text-foreground hover:bg-muted/50": !isActive,
    }
  );

  const sidebarContent = (isMobile: boolean) => {
    const isExpanded = isMobile ? true : expanded;

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <Logo showText={false} size="sm" />
            {isExpanded && (
              <span className="font-bold text-base">Painel</span>
            )}
          </div>

          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.href}
                      end
                      className={navItemClasses}
                      onClick={() => isMobile && toggleMobileSidebar()}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-foreground" />
                          )}
                          <item.icon className="h-5 w-5 shrink-0" />
                          {isExpanded && <span className="text-sm">{item.name}</span>}
                        </>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {!isExpanded && <TooltipContent side="right">{item.name}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Catalog group */}
            <CollapsibleGroup
              label="Catálogo"
              icon={BookOpen}
              isGroupActive={isCatalogSection}
              isOpen={catalogExpanded}
              onToggle={() => setCatalogExpanded(!catalogExpanded)}
              isExpanded={isExpanded}
              items={catalogSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
            />

            {/* Stock group */}
            <CollapsibleGroup
              label="Estoque"
              icon={Warehouse}
              isGroupActive={isStockSection}
              isOpen={stockExpanded}
              onToggle={() => setStockExpanded(!stockExpanded)}
              isExpanded={isExpanded}
              items={stockSubItems}
              onItemClick={() => isMobile && toggleMobileSidebar()}
            />

            {/* Sales group */}
            <CollapsibleGroup
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

            <Separator className="my-2" />

            {bottomNavigation.map((item) => (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.href}
                      className={navItemClasses}
                      onClick={() => isMobile && toggleMobileSidebar()}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-foreground" />
                          )}
                          <item.icon className="h-5 w-5 shrink-0" />
                          {isExpanded && <span className="text-sm">{item.name}</span>}
                        </>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {!isExpanded && <TooltipContent side="right">{item.name}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3">
          <PlanUsageIndicator expanded={isExpanded} />
          <Separator className="my-3" />
          <button
            className="flex items-center gap-3 w-full rounded-lg p-2.5 hover:bg-muted/60 transition-colors text-left"
            onClick={() => setShowSubscriptionModal(true)}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback className="text-xs font-medium">{getInitials(user?.name || '')}</AvatarFallback>
            </Avatar>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <div className="mt-0.5">
                  <PlanStatusBadge status={user?.plan_status} />
                </div>
              </div>
            )}
          </button>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 py-2.5 px-2.5 w-full text-left text-muted-foreground hover:text-destructive transition-colors mt-1 rounded-lg"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isExpanded && <span className="text-sm">Sair</span>}
          </button>
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
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 z-50 transition-transform duration-300 md:hidden flex flex-col bg-background shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent(true)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen bg-background shadow-lg transition-all duration-300",
          expanded ? "w-64" : "w-16"
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

interface CollapsibleGroupProps {
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

function CollapsibleGroup({ label, icon: Icon, isGroupActive, isOpen, onToggle, isExpanded, items, onItemClick, badge }: CollapsibleGroupProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "relative flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 w-full text-left",
                isGroupActive
                  ? "bg-muted/80 text-foreground font-medium border border-border/60 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isGroupActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-foreground" />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {isExpanded && (
                <>
                  <span className="text-sm flex-1">{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white animate-pulse">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>

      {isOpen && isExpanded && (
        <div className="mt-1 ml-4 pl-4 border-l border-border/50 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) => cn(
                "flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "text-foreground font-medium bg-muted/70"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
              {item.comingSoon && (
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 opacity-60">Breve</Badge>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
