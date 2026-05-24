import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, ChevronLeft, ChevronRight, Menu, X, ChartLine as LineChart, Settings, FolderTree, Gift, CircleHelp as HelpCircle, ShoppingBag, ClipboardList, CreditCard, ChevronDown, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
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
  const [salesExpanded, setSalesExpanded] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const { signOut, user } = useAuth();
  const location = useLocation();

  const isCatalogSection = location.pathname.startsWith('/dashboard/listings') || location.pathname.startsWith('/dashboard/categories');
  const isSalesSection = location.pathname.startsWith('/dashboard/orders') || location.pathname.startsWith('/dashboard/sales');

  useEffect(() => {
    if (isCatalogSection) setCatalogExpanded(true);
  }, [isCatalogSection]);

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

  const salesSubItems = [
    { name: 'Pedidos', href: '/dashboard/orders', icon: ClipboardList, badge: pendingOrders },
    { name: 'Vendas Online', href: '/dashboard/sales', icon: CreditCard, comingSoon: true },
  ];

  const navigationAfterSales = [
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    { name: 'Central de Ajuda', href: '/help', icon: HelpCircle },
  ];

  const isReferralActive = location.pathname === '/dashboard/referral';
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Classes for navigation links
  const navItemClasses = ({ isActive }: { isActive: boolean }) => {
    return cn(
      "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors",
      {
        "bg-primary/10 text-primary": isActive,
        "hover:bg-muted text-muted-foreground hover:text-foreground": !isActive,
      }
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
          "fixed inset-y-0 left-0 w-64 bg-background border-r z-50 transition-transform duration-300 md:hidden flex flex-col",
          {
            "translate-x-0": mobileOpen,
            "-translate-x-full": !mobileOpen,
          }
        )}
      >
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <NavLink to="/" className="flex items-center space-x-2">
            <Logo size="md" showText={false} />
          </NavLink>
          
          {/* Mobile close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileSidebar}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Desktop expand/collapse button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="px-2 py-2">
          <nav className="space-y-1 flex flex-col">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navItemClasses}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
              </NavLink>
            ))}

            {/* Catalog Group */}
            <div>
              <button
                onClick={() => setCatalogExpanded(!catalogExpanded)}
                className={cn(
                  "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors w-full text-left",
                  isCatalogSection ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="h-5 w-5" />
                <span className="flex-1">Catálogo</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", catalogExpanded && "rotate-180")} />
              </button>
              {catalogExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {catalogSubItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={navItemClasses}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Sales Group */}
            <div>
              <button
                onClick={() => setSalesExpanded(!salesExpanded)}
                className={cn(
                  "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors w-full text-left",
                  isSalesSection ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="flex-1">Vendas</span>
                {pendingOrders > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                    {pendingOrders > 99 ? '99+' : pendingOrders}
                  </span>
                )}
                <ChevronDown className={cn("h-4 w-4 transition-transform", salesExpanded && "rotate-180")} />
              </button>
              {salesExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {salesSubItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={navItemClasses}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                      {'comingSoon' in item && item.comingSoon && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 ml-auto">Breve</Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {navigationAfterSales.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navItemClasses}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="px-2 pb-1">
            <Separator className="mb-2" />
            <NavLink
              to="/dashboard/referral"
              className={cn(
                "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors",
                isReferralActive
                  ? "bg-primary/10 text-primary"
                  : "text-primary/80 hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Gift className="h-5 w-5" />
              <span className="flex-1 font-medium">Indique e Ganhe</span>
            </NavLink>
          </div>
          <PlanUsageIndicator expanded={true} />
          <div className="p-4">
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-3 mb-4 transition-colors"
              onClick={() => setShowSubscriptionModal(true)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-sm">{getInitials(user?.name || '')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <div className="mt-1">
                  <PlanStatusBadge status={user?.plan_status} />
                </div>
              </div>
            </div>

            <Separator className="mb-4" />

            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="w-full justify-start text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={cn(
          "hidden md:flex flex-col h-screen border-r bg-background transition-all duration-300",
          {
            "w-64": expanded,
            "w-16": !expanded,
          }
        )}
      >
        <div className="flex items-center justify-between p-4">
          <NavLink to="/" className="flex items-center space-x-2">
            <Logo size="md" showText={false} />
          </NavLink>
          
          {/* Mobile close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileSidebar}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Desktop expand/collapse button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            {expanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="px-2 py-2 flex-1">
          <nav className="space-y-1 flex flex-col">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navItemClasses}
              >
                <item.icon className="h-5 w-5" />
                {expanded && <span className="flex-1">{item.name}</span>}
              </NavLink>
            ))}

            {/* Catalog Group */}
            <div>
              <button
                onClick={() => setCatalogExpanded(!catalogExpanded)}
                className={cn(
                  "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors w-full text-left",
                  isCatalogSection ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="h-5 w-5" />
                {expanded && (
                  <>
                    <span className="flex-1">Catálogo</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", catalogExpanded && "rotate-180")} />
                  </>
                )}
              </button>
              {catalogExpanded && expanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {catalogSubItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={navItemClasses}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Sales Group */}
            <div>
              <button
                onClick={() => setSalesExpanded(!salesExpanded)}
                className={cn(
                  "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors w-full text-left",
                  isSalesSection ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ShoppingBag className="h-5 w-5" />
                {expanded && (
                  <>
                    <span className="flex-1">Vendas</span>
                    {pendingOrders > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                        {pendingOrders > 99 ? '99+' : pendingOrders}
                      </span>
                    )}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", salesExpanded && "rotate-180")} />
                  </>
                )}
              </button>
              {salesExpanded && expanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {salesSubItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={navItemClasses}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                      {'comingSoon' in item && item.comingSoon && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 ml-auto">Breve</Badge>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {navigationAfterSales.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navItemClasses}
              >
                <item.icon className="h-5 w-5" />
                {expanded && <span className="flex-1">{item.name}</span>}
                {expanded && 'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto flex-shrink-0">
          <div className="px-2 pb-1">
            <Separator className="mb-2" />
            <NavLink
              to="/dashboard/referral"
              className={cn(
                "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors",
                isReferralActive
                  ? "bg-primary/10 text-primary"
                  : "text-primary/80 hover:bg-primary/5 hover:text-primary"
              )}
            >
              <Gift className="h-5 w-5" />
              {expanded && <span className="flex-1 font-medium">Indique e Ganhe</span>}
            </NavLink>
          </div>
          <PlanUsageIndicator expanded={expanded} />
          <div className="p-4">
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-3 mb-4 transition-colors"
              onClick={() => setShowSubscriptionModal(true)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-sm">{getInitials(user?.name || '')}</AvatarFallback>
              </Avatar>
              {expanded && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  <div className="mt-1">
                    <PlanStatusBadge status={user?.plan_status} />
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="w-full justify-start text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {expanded && <span className="ml-3">Sair</span>}
            </Button>
          </div>
        </div>
      </div>

      <SubscriptionModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal} 
      />
    </>
  );
}