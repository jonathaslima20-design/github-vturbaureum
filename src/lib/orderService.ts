import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, OrderStatus } from '@/types';

interface CreateOrderData {
  store_owner_id: string;
  customer_name: string;
  customer_whatsapp: string;
  customer_country_code: string;
  order_type: 'whatsapp' | 'ecommerce';
  subtotal: number;
  total: number;
  notes?: string;
  whatsapp_message?: string;
  source: 'cart' | 'product_page';
}

interface CreateOrderItemData {
  product_id: string;
  product_title: string;
  product_image_url?: string;
  quantity: number;
  unit_price: number;
  selected_color?: string | null;
  selected_size?: string | null;
  selected_flavor?: string | null;
  selected_variant_label?: string | null;
  item_notes?: string;
  subtotal: number;
}

export async function createOrder(
  orderData: CreateOrderData,
  items: CreateOrderItemData[]
): Promise<Order | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      store_owner_id: orderData.store_owner_id,
      customer_name: orderData.customer_name,
      customer_whatsapp: orderData.customer_whatsapp,
      customer_country_code: orderData.customer_country_code,
      order_type: orderData.order_type,
      subtotal: orderData.subtotal,
      total: orderData.total,
      notes: orderData.notes || '',
      whatsapp_message: orderData.whatsapp_message || '',
      source: orderData.source,
    })
    .select()
    .maybeSingle();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    return null;
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_title: item.product_title,
    product_image_url: item.product_image_url || '',
    quantity: item.quantity,
    unit_price: item.unit_price,
    selected_color: item.selected_color || null,
    selected_size: item.selected_size || null,
    selected_flavor: item.selected_flavor || null,
    selected_variant_label: item.selected_variant_label || null,
    item_notes: item.item_notes || '',
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
  }

  return order as Order;
}

interface FetchOrdersFilters {
  status?: OrderStatus;
  search?: string;
}

export async function fetchOrders(
  storeOwnerId: string,
  limit = 20,
  offset = 0,
  filters?: FetchOrdersFilters
): Promise<{ data: Order[]; count: number }> {
  let query = supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .eq('store_owner_id', storeOwnerId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.ilike('customer_name', `%${filters.search}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return { data: [], count: 0 };
  }

  return { data: (data || []) as Order[], count: count || 0 };
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data as Order | null;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export async function getOrderStats(storeOwnerId: string): Promise<OrderStats> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('orders')
    .select('status, total')
    .eq('store_owner_id', storeOwnerId)
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error || !data) {
    console.error('Error fetching order stats:', error);
    return { total: 0, pending: 0, confirmed: 0, preparing: 0, shipped: 0, delivered: 0, cancelled: 0, totalRevenue: 0 };
  }

  const stats: OrderStats = {
    total: data.length,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  };

  for (const order of data) {
    const status = order.status as OrderStatus;
    if (status in stats) {
      stats[status as keyof Omit<OrderStats, 'total' | 'totalRevenue'>]++;
    }
    if (status !== 'cancelled') {
      stats.totalRevenue += Number(order.total) || 0;
    }
  }

  return stats;
}

export async function getPendingOrderCount(storeOwnerId: string): Promise<number> {
  const { count, error } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('store_owner_id', storeOwnerId)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching pending order count:', error);
    return 0;
  }

  return count || 0;
}
