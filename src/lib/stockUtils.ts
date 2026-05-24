import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'untracked';

export function getStockStatus(product: Pick<Product, 'track_inventory' | 'stock_quantity' | 'low_stock_threshold'>): StockStatus {
  if (!product.track_inventory || product.stock_quantity == null) {
    return 'untracked';
  }
  if (product.stock_quantity <= 0) {
    return 'out_of_stock';
  }
  if (product.stock_quantity <= (product.low_stock_threshold ?? 5)) {
    return 'low_stock';
  }
  return 'in_stock';
}

interface DeductionItem {
  product_id: string;
  quantity: number;
}

interface DeductionResult {
  success: boolean;
  notifications: { productId: string; productTitle: string; type: 'low_stock' | 'out_of_stock' }[];
}

export async function deductStockForOrder(
  orderId: string,
  storeOwnerId: string,
  items: DeductionItem[]
): Promise<DeductionResult> {
  const notifications: DeductionResult['notifications'] = [];

  for (const item of items) {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, title, track_inventory, stock_quantity, low_stock_threshold')
      .eq('id', item.product_id)
      .maybeSingle();

    if (fetchError || !product || !product.track_inventory) continue;

    const newQuantity = (product.stock_quantity ?? 0) - item.quantity;

    const { error: updateError } = await supabase
      .from('products')
      .update({ stock_quantity: newQuantity })
      .eq('id', item.product_id)
      .eq('track_inventory', true);

    if (updateError) continue;

    const threshold = product.low_stock_threshold ?? 5;
    if (newQuantity <= 0) {
      notifications.push({ productId: product.id, productTitle: product.title, type: 'out_of_stock' });
    } else if (newQuantity <= threshold) {
      notifications.push({ productId: product.id, productTitle: product.title, type: 'low_stock' });
    }
  }

  await supabase
    .from('orders')
    .update({ inventory_deducted: true })
    .eq('id', orderId);

  for (const n of notifications) {
    await createStockNotification(storeOwnerId, n.productId, n.productTitle, n.type);
  }

  return { success: true, notifications };
}

export async function restoreStockForOrder(
  orderId: string,
  items: DeductionItem[]
): Promise<boolean> {
  for (const item of items) {
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, track_inventory, stock_quantity')
      .eq('id', item.product_id)
      .maybeSingle();

    if (fetchError || !product || !product.track_inventory) continue;

    const newQuantity = (product.stock_quantity ?? 0) + item.quantity;

    await supabase
      .from('products')
      .update({ stock_quantity: newQuantity })
      .eq('id', item.product_id);
  }

  await supabase
    .from('orders')
    .update({ inventory_deducted: false })
    .eq('id', orderId);

  return true;
}

export async function createStockNotification(
  userId: string,
  productId: string,
  productTitle: string,
  type: 'low_stock' | 'out_of_stock'
): Promise<void> {
  const title = type === 'low_stock' ? 'Estoque baixo' : 'Produto esgotado';
  const message = type === 'low_stock'
    ? `O produto "${productTitle}" está com estoque baixo.`
    : `O produto "${productTitle}" está esgotado.`;

  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message,
    related_entity_id: productId,
    related_entity_type: 'product',
  });
}

export async function updateProductStock(
  productId: string,
  newQuantity: number
): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .update({ stock_quantity: newQuantity })
    .eq('id', productId);

  return !error;
}
