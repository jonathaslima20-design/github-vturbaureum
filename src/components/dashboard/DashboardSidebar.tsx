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

  const navItemClasses = ({ isActive }: { isActive: boolean }) => {
    return cn(
      "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors duration-150 relative",
      {
        "bg-white/10 text-foreground font-medium": isActive,
        "hover:bg-white/5 text-muted-foreground hover:text-foreground": !isActive,
      }
    );
  };

  const renderNavContent = (isDesktop: boolean) => (
    <>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-5 border-b border-border/40",
        !isDesktop && "py-4"
      )}>
        <NavLink to="/" className="flex items-center">
          <Logo size="md" showText={false} />
        </NavLink>

        {isDesktop ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full hover:bg-white/10 transition-colors"
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileSidebar}
            className="h-8 w-8 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <nav className="space-y-0.5 flex flex-col">
          {navigation.map((item) => (
            <NavItemWithTooltip
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              expanded={isDesktop ? expanded : true}
              navItemClasses={navItemClasses}
            />
          ))}

          {/* Catalog Group */}
          <ExpandableGroup
            label="Catálogo"
            icon={BookOpen}
            isActive={isCatalogSection}
            isExpanded={catalogExpanded}
            onToggle={() => setCatalogExpanded(!catalogExpanded)}
            expanded={isDesktop ? expanded : true}
            items={catalogSubItems}
            navItemClasses={navItemClasses}
          />

          {/* Stock Group */}
          <ExpandableGroup
            label="Estoque"
            icon={Warehouse}
            isActive={isStockSection}
            isExpanded={stockExpanded}
            onToggle={() => setStockExpanded(!stockExpanded)}
            expanded={isDesktop ? expanded : true}
            items={stockSubItems}
            navItemClasses={navItemClasses}
          />

          {/* Sales Group */}
          <div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setSalesExpanded(!salesExpanded)}
                    className={cn(
                      "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors duration-150 w-full text-left",
                      isSalesSection ? "bg-white/10 text-foreground font-medium" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ShoppingBag className="h-5 w-5 flex-shrink-0" />
                    {(isDesktop ? expanded : true) && (
                      <>
                        <span className="flex-1">Vendas</span>
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
                {isDesktop && !expanded && (
                  <TooltipContent side="right" className="font-medium">
                    Vendas
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            {salesExpanded && (isDesktop ? expanded : true) && (
              <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border/40 pl-3">
                {salesSubItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={navItemClasses}
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
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
            <NavItemWithTooltip
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              expanded={isDesktop ? expanded : true}
              navItemClasses={navItemClasses}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto flex-shrink-0">
        <div className="px-3 pb-2">
          <div className="border-t border-border/40 pt-3">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/dashboard/referral"
                    className={cn(
                      "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors duration-150",
                      isReferralActive
                        ? "bg-white/10 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Gift className="h-5 w-5 flex-shrink-0" />
                    {(isDesktop ? expanded : true) && <span className="flex-1">Indique e Ganhe</span>}
                  </NavLink>
                </TooltipTrigger>
                {isDesktop && !expanded && (
                  <TooltipContent side="right" className="font-medium">
                    Indique e Ganhe
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <PlanUsageIndicator expanded={isDesktop ? expanded : true} />

        <div className="px-3 pb-4">
          <div
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-colors duration-150",
              "bg-white/5 hover:bg-white/10 border border-border/30"
            )}
            onClick={() => setShowSubscriptionModal(true)}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user?.avatar_url} alt={user?.name} />
              <AvatarFallback className="text-sm">{getInitials(user?.name || '')}</AvatarFallback>
            </Avatar>
            {(isDesktop ? expanded : true) && (
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
                  className="w-full justify-start text-red-400/70 hover:text-red-400 hover:bg-red-500/10 mt-2 transition-colors duration-150"
                >
                  <LogOut className="h-5 w-5" />
                  {(isDesktop ? expanded : true) && <span className="ml-3">Sair</span>}
                </Button>
              </TooltipTrigger>
              {isDesktop && !expanded && (
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
          {
            "opacity-100": mobileOpen,
            "opacity-0 pointer-events-none": !mobileOpen,
          }
        )}
        onClick={toggleMobileSidebar}
      />

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-background border-r border-border/50 z-50 transition-transform duration-300 md:hidden flex flex-col",
          {
            "translate-x-0": mobileOpen,
            "-translate-x-full": !mobileOpen,
          }
        )}
      >
        {renderNavContent(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-border/50 bg-background transition-all duration-300",
          {
            "w-64": expanded,
            "w-[68px]": !expanded,
          }
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

interface NavItemWithTooltipProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  navItemClasses: (props: { isActive: boolean }) => string;
}

function NavItemWithTooltip({ name, href, icon: Icon, expanded, navItemClasses }: NavItemWithTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink to={href} className={navItemClasses}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            {expanded && <span className="flex-1">{name}</span>}
          </NavLink>
        </TooltipTrigger>
        {!expanded && (
          <TooltipContent side="right" className="font-medium">
            {name}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

interface ExpandableGroupProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  expanded: boolean;
  items: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
  navItemClasses: (props: { isActive: boolean }) => string;
}

function ExpandableGroup({ label, icon: Icon, isActive, isExpanded, onToggle, expanded, items, navItemClasses }: ExpandableGroupProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors duration-150 w-full text-left",
                isActive ? "bg-white/10 text-foreground font-medium" : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {expanded && (
                <>
                  <span className="flex-1">{label}</span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                </>
              )}
            </button>
          </TooltipTrigger>
          {!expanded && (
            <TooltipContent side="right" className="font-medium">
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      {isExpanded && expanded && (
        <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border/40 pl-3">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={navItemClasses}
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
