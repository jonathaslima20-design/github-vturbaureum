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

  const sidebarExpanded = (isDesktop: boolean) => isDesktop ? expanded : true;

  const renderNavContent = (isDesktop: boolean) => {
    const isExpanded = sidebarExpanded(isDesktop);

    return (
      <>
        {/* Header */}
        <div className={cn(
          "flex items-center px-4 py-5",
          isExpanded ? "justify-between" : "justify-center"
        )}>
          {isExpanded && (
            <NavLink to="/" className="flex items-center">
              <Logo size="md" showText={false} />
            </NavLink>
          )}

          {isDesktop ? (
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileSidebar}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="px-3 py-2 flex-1 overflow-y-auto">
          <nav className="space-y-1 flex flex-col">
            {navigation.map((item) => (
              <SidebarNavItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                isExpanded={isExpanded}
              />
            ))}

            {/* Catalog Group */}
            <SidebarGroup
              label="Catálogo"
              icon={BookOpen}
              isActive={isCatalogSection}
              isOpen={catalogExpanded}
              onToggle={() => setCatalogExpanded(!catalogExpanded)}
              isExpanded={isExpanded}
              items={catalogSubItems}
            />

            {/* Stock Group */}
            <SidebarGroup
              label="Estoque"
              icon={Warehouse}
              isActive={isStockSection}
              isOpen={stockExpanded}
              onToggle={() => setStockExpanded(!stockExpanded)}
              isExpanded={isExpanded}
              items={stockSubItems}
            />

            {/* Sales Group */}
            <div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSalesExpanded(!salesExpanded)}
                      className={cn(
                        "flex items-center gap-3 py-3 px-4 rounded-lg w-full text-left transition-all duration-200",
                        isSalesSection
                          ? "bg-muted/80 text-foreground font-medium border border-border/60 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <ShoppingBag className={cn("h-5 w-5 flex-shrink-0 transition-opacity", !isSalesSection && "opacity-70")} />
                      {isExpanded && (
                        <>
                          <span className="flex-1 text-sm">Vendas</span>
                          {pendingOrders > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white animate-pulse">
                              {pendingOrders > 99 ? '99+' : pendingOrders}
                            </span>
                          )}
                          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", salesExpanded && "rotate-180")} />
                        </>
                      )}
                    </button>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right" className="font-medium">
                      Vendas
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {salesExpanded && isExpanded && (
                <div className="mt-1 ml-4 pl-4 space-y-0.5">
                  {salesSubItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all duration-200",
                        isActive
                          ? "text-foreground font-medium bg-muted/60"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4")} />
                      <span className="flex-1">{item.name}</span>
                      {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                      {'comingSoon' in item && item.comingSoon && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 ml-auto opacity-60">Breve</Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {navigationAfterSales.map((item) => (
              <SidebarNavItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                isExpanded={isExpanded}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto flex-shrink-0">
          {/* Referral link */}
          <div className="px-3 mb-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/dashboard/referral"
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-lg text-sm transition-all duration-200",
                      isReferralActive
                        ? "bg-muted/80 text-foreground font-medium border border-border/60 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Gift className={cn("h-5 w-5 flex-shrink-0 transition-opacity", !isReferralActive && "opacity-70")} />
                    {isExpanded && <span className="flex-1">Indique e Ganhe</span>}
                  </NavLink>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="font-medium">
                    Indique e Ganhe
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <PlanUsageIndicator expanded={isExpanded} />

          {/* User card */}
          <div className="px-3 pb-4">
            <div
              className={cn(
                "flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-all duration-200",
                "bg-card border border-border shadow-sm hover:shadow-md hover:border-border/80"
              )}
              onClick={() => setShowSubscriptionModal(true)}
            >
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-xs">{getInitials(user?.name || '')}</AvatarFallback>
              </Avatar>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  <div className="mt-1">
                    <PlanStatusBadge status={user?.plan_status} />
                  </div>
                </div>
              )}
            </div>

            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className={cn(
                      "w-full mt-2 transition-colors duration-200",
                      isExpanded ? "justify-start" : "justify-center",
                      "text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    {isExpanded && <span className="ml-3 text-sm">Sair</span>}
                  </Button>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" className="font-medium">
                    Sair
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
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
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 z-50 transition-transform duration-300 md:hidden flex flex-col",
          "bg-background shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {renderNavContent(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen bg-background shadow-lg transition-all duration-300",
          expanded ? "w-64" : "w-[68px]"
        )}
      >
        {renderNavContent(true)}
      </div>

      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
    </>
  );
}

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
}

function SidebarNavItem({ name, href, icon: Icon, isExpanded }: SidebarNavItemProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={href}
            end={href === '/dashboard'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 relative",
              isActive
                ? "bg-muted/80 text-foreground font-medium border border-border/60 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-foreground" />
                )}
                <Icon className={cn("h-5 w-5 flex-shrink-0 transition-opacity", !isActive && "opacity-70")} />
                {isExpanded && <span className="text-sm flex-1">{name}</span>}
              </>
            )}
          </NavLink>
        </TooltipTrigger>
        {!isExpanded && (
          <TooltipContent side="right" className="font-medium">
            {name}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface SidebarGroupProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isExpanded: boolean;
  items: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
}

function SidebarGroup({ label, icon: Icon, isActive, isOpen, onToggle, isExpanded, items }: SidebarGroupProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center gap-3 py-3 px-4 rounded-lg w-full text-left transition-all duration-200",
                isActive
                  ? "bg-muted/80 text-foreground font-medium border border-border/60 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0 transition-opacity", !isActive && "opacity-70")} />
              {isExpanded && (
                <>
                  <span className="flex-1 text-sm">{label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="font-medium">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {isOpen && isExpanded && (
        <div className="mt-1 ml-4 pl-4 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: active }) => cn(
                "flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all duration-200",
                active
                  ? "text-foreground font-medium bg-muted/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
