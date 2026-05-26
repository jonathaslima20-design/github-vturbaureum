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

  const navigationAfterSales = [
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    { name: 'Central de Ajuda', href: '/help', icon: HelpCircle },
  ];

  const isReferralActive = location.pathname === '/dashboard/referral';

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const navItemClasses = ({ isActive }: { isActive: boolean }) => cn(
    "flex items-center space-x-2 md:space-x-3 py-2.5 px-2.5 md:px-3 rounded-xl transition-all duration-200 min-h-[40px] md:min-h-[44px]",
    {
      "bg-foreground text-background font-medium shadow-sm": isActive,
      "hover:bg-muted text-muted-foreground hover:text-foreground": !isActive,
    }
  );

  const sidebarContent = (isDesktop: boolean) => {
    const isExpanded = isDesktop ? expanded : true;

    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center space-x-2">
            <Logo showText={false} size="sm" className="md:w-8 md:h-8" />
            {isExpanded && (
              <span className="font-bold text-sm md:text-base">Painel</span>
            )}
          </div>

          {!isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {isDesktop && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="px-2 py-2 flex-1 overflow-y-auto">
          <nav className="space-y-0.5 flex flex-col">
            {navigation.map((item) => (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.href}
                      end={item.href === '/dashboard'}
                      className={navItemClasses}
                      onClick={() => !isDesktop && toggleMobileSidebar()}
                    >
                      <item.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      {isExpanded && <span className="text-sm md:text-base">{item.name}</span>}
                    </NavLink>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Catalog Group */}
            <GroupItem
              label="Catálogo"
              icon={BookOpen}
              isGroupActive={isCatalogSection}
              isOpen={catalogExpanded}
              onToggle={() => setCatalogExpanded(!catalogExpanded)}
              isExpanded={isExpanded}
              items={catalogSubItems}
              onItemClick={() => !isDesktop && toggleMobileSidebar()}
            />

            {/* Stock Group */}
            <GroupItem
              label="Estoque"
              icon={Warehouse}
              isGroupActive={isStockSection}
              isOpen={stockExpanded}
              onToggle={() => setStockExpanded(!stockExpanded)}
              isExpanded={isExpanded}
              items={stockSubItems}
              onItemClick={() => !isDesktop && toggleMobileSidebar()}
            />

            {/* Sales Group */}
            <div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSalesExpanded(!salesExpanded)}
                      className={cn(
                        "flex items-center space-x-2 md:space-x-3 py-2.5 px-2.5 md:px-3 rounded-xl transition-all duration-200 min-h-[40px] md:min-h-[44px] w-full text-left",
                        isSalesSection
                          ? "bg-foreground text-background font-medium shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      {isExpanded && (
                        <>
                          <span className="text-sm md:text-base flex-1">Vendas</span>
                          {pendingOrders > 0 && (
                            <span className={cn(
                              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold animate-pulse",
                              isSalesSection ? "bg-background text-foreground" : "bg-red-500 text-white"
                            )}>
                              {pendingOrders > 99 ? '99+' : pendingOrders}
                            </span>
                          )}
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", salesExpanded && "rotate-180")} />
                        </>
                      )}
                    </button>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right">Vendas</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {salesExpanded && isExpanded && (
                <div className="mt-1 ml-3 pl-3 space-y-0.5 border-l border-border">
                  {salesSubItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => !isDesktop && toggleMobileSidebar()}
                      className={({ isActive }) => cn(
                        "flex items-center space-x-2 py-2 px-2.5 rounded-lg text-sm transition-all duration-200",
                        isActive
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                      {'comingSoon' in item && item.comingSoon && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 opacity-60">Breve</Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {navigationAfterSales.map((item) => (
              <TooltipProvider key={item.name} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.href}
                      className={navItemClasses}
                      onClick={() => !isDesktop && toggleMobileSidebar()}
                    >
                      <item.icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                      {isExpanded && <span className="text-sm md:text-base">{item.name}</span>}
                    </NavLink>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto p-3 md:p-4">
          {/* Referral */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/dashboard/referral"
                  onClick={() => !isDesktop && toggleMobileSidebar()}
                  className={cn(
                    "flex items-center space-x-2 md:space-x-3 py-2.5 px-2.5 md:px-3 rounded-xl transition-all duration-200 min-h-[40px] md:min-h-[44px]",
                    isReferralActive
                      ? "bg-foreground text-background font-medium shadow-sm"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Gift className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                  {isExpanded && <span className="text-sm md:text-base">Indique e Ganhe</span>}
                </NavLink>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">Indique e Ganhe</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <PlanUsageIndicator expanded={isExpanded} />

          <Separator className="my-3" />

          {/* User card */}
          <button
            className="flex items-center space-x-3 w-full rounded-xl p-2 hover:bg-muted transition-colors text-left"
            onClick={() => setShowSubscriptionModal(true)}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback className="text-xs">{getInitials(user?.name || '')}</AvatarFallback>
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

          {/* Logout */}
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 py-2 px-2.5 w-full text-left text-muted-foreground hover:text-destructive transition-colors mt-1 rounded-lg"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            {isExpanded && <span className="text-sm md:text-base">Sair</span>}
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
          expanded ? "w-64" : "w-16"
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

interface GroupItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isGroupActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isExpanded: boolean;
  items: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
  onItemClick: () => void;
}

function GroupItem({ label, icon: Icon, isGroupActive, isOpen, onToggle, isExpanded, items, onItemClick }: GroupItemProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center space-x-2 md:space-x-3 py-2.5 px-2.5 md:px-3 rounded-xl transition-all duration-200 min-h-[40px] md:min-h-[44px] w-full text-left",
                isGroupActive
                  ? "bg-foreground text-background font-medium shadow-sm"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              {isExpanded && (
                <>
                  <span className="text-sm md:text-base flex-1">{label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right">{label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {isOpen && isExpanded && (
        <div className="mt-1 ml-3 pl-3 space-y-0.5 border-l border-border">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive }) => cn(
                "flex items-center space-x-2 py-2 px-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
