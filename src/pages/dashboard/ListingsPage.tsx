import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Loader } from 'lucide-react';
import { ListingsHeader } from '@/components/dashboard/ListingsHeader';
import { ListingsFilters } from '@/components/dashboard/ListingsFilters';
import { ListingsStatusBar } from '@/components/dashboard/ListingsStatusBar';
import { ProductGrid } from '@/components/dashboard/ProductGrid';
import { BulkActionsPanel } from '@/components/dashboard/BulkActionsPanel';
import DashboardInfiniteScrollTrigger from '@/components/dashboard/DashboardInfiniteScrollTrigger';
import { useProductListManagement } from '@/hooks/useProductListManagement';
import { ListingsErrorBoundary } from '@/components/listings/ListingsErrorBoundary';
import { ListingsErrorAlert } from '@/components/listings/ListingsErrorAlert';
import { ListingsDebugPanel } from '@/components/listings/ListingsDebugPanel';
import { ListingsHeaderSkeleton, ListingsFiltersSkeleton, ListingsStatusBarSkeleton, ProductGridSkeleton } from '@/components/dashboard/ListingsSkeletons';
import { LoadingProgressIndicator } from '@/components/listings/LoadingProgressIndicator';
import { SectionErrorBoundary } from '@/components/listings/SectionErrorBoundary';

export default function ListingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const MAX_RETRIES = 3;

  // Call useProductListManagement unconditionally - it handles null/undefined userId gracefully
  const {
    products,
    filteredProducts,
    filteredProductsByCategory,
    loading,
    error,
    errorCategory,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    availableCategories,
    updatingProductId,
    reordering,
    isReorderModeActive,
    setIsReorderModeActive,
    selectedProducts,
    setSelectedProducts,
    bulkActionLoading,
    canReorder,
    allSelected,
    someSelected,
    totalCategoriesCount,
    displayedCategoriesCount,
    hasNextCategory,
    dismissError,
    toggleProductVisibility,
    handleSelectProduct,
    handleSelectAll,
    handleBulkVisibilityToggle,
    handleBulkCategoryChange,
    handleBulkBrandChange,
    handleBulkDelete,
    handleBulkImageCompression,
    handleDragEnd,
    refreshProducts,
    loadNextCategory,
    loadAllCategories
  } = useProductListManagement({ userId: user?.id });

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && (!user || !user.id)) {
      console.warn('⚠️ Authentication validation failed: Missing user or user.id');
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [authLoading, user, navigate, location]);

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.id) {
    return null;
  }

  return (
    <ListingsErrorBoundary>
      <LoadingProgressIndicator
        isLoading={loading}
        isRetrying={false}
        retryCount={0}
        maxRetries={MAX_RETRIES}
        message="Carregando seus produtos..."
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 space-y-6">
        {error && (
          <ListingsErrorAlert
            error={error}
            category={errorCategory}
            onDismiss={dismissError}
            onRetry={refreshProducts}
            showRetry={!loading}
          />
        )}

        <SectionErrorBoundary
          sectionName="cabeçalho"
          onRetry={() => window.location.reload()}
        >
          {loading ? (
            <ListingsHeaderSkeleton />
          ) : (
            <ListingsHeader
              canReorder={canReorder}
              isReorderModeActive={isReorderModeActive}
              reordering={reordering}
              allSelected={allSelected}
              filteredProductsLength={filteredProducts.length}
              onToggleReorderMode={() => setIsReorderModeActive(!isReorderModeActive)}
              onSelectAll={handleSelectAll}
            />
          )}
        </SectionErrorBoundary>

        <SectionErrorBoundary
          sectionName="filtros"
          onRetry={() => setSearchQuery('')}
        >
          {loading ? (
            <ListingsFiltersSkeleton />
          ) : (
            <ListingsFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              availableCategories={availableCategories}
            />
          )}
        </SectionErrorBoundary>

        <SectionErrorBoundary
          sectionName="barra de status"
          onRetry={() => window.location.reload()}
        >
          {loading ? (
            <ListingsStatusBarSkeleton />
          ) : (
            <ListingsStatusBar
              totalCount={products.length}
              filteredCount={filteredProducts.length}
              selectedCount={selectedProducts.size}
              allSelected={allSelected}
              onSelectAll={handleSelectAll}
            />
          )}
        </SectionErrorBoundary>

        <SectionErrorBoundary
          sectionName="ações em lote"
          onRetry={() => setSelectedProducts(new Set())}
        >
          {selectedProducts.size > 0 && !loading && (
            <BulkActionsPanel
              selectedCount={selectedProducts.size}
              onBulkVisibilityToggle={handleBulkVisibilityToggle}
              onBulkCategoryChange={handleBulkCategoryChange}
              onBulkBrandChange={handleBulkBrandChange}
              onBulkDelete={handleBulkDelete}
              onBulkImageCompression={handleBulkImageCompression}
              onClearSelection={() => setSelectedProducts(new Set())}
              loading={bulkActionLoading}
              userId={user.id}
            />
          )}
        </SectionErrorBoundary>

        <SectionErrorBoundary
          sectionName="grade de produtos"
          onRetry={refreshProducts}
        >
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              productsByCategory={Object.keys(filteredProductsByCategory).length > 0 ? filteredProductsByCategory : undefined}
              isDragMode={isReorderModeActive}
              reordering={reordering}
              bulkActionLoading={bulkActionLoading}
              selectedProducts={selectedProducts}
              updatingProductId={updatingProductId}
              user={user}
              onSelectProduct={handleSelectProduct}
              onToggleVisibility={toggleProductVisibility}
              onDragEnd={handleDragEnd}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum produto encontrado</p>
              <Button onClick={() => navigate('/dashboard/products/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Produto
              </Button>
            </div>
          )}
        </SectionErrorBoundary>

        <SectionErrorBoundary
          sectionName="carregamento infinito"
          onRetry={loadNextCategory}
        >
          {filteredProducts.length > 0 && !loading && (
            <DashboardInfiniteScrollTrigger
              onLoadMore={loadNextCategory}
              onLoadAll={loadAllCategories}
              hasNextPage={hasNextCategory}
              isLoading={loading}
              displayedCategoriesCount={displayedCategoriesCount}
              totalCategoriesCount={totalCategoriesCount}
            />
          )}
        </SectionErrorBoundary>

        <ListingsDebugPanel
          userId={user.id}
          loading={loading}
          error={error}
          productCount={products.length}
          filteredCount={filteredProducts.length}
        />
      </div>
    </ListingsErrorBoundary>
  );
}
