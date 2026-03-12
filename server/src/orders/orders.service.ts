import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

interface OrderItemInput {
  dishId: string;
  dishName: string;
  dishPrice: number;
  quantity: number;
  subtotal: number;
  remark?: string;
}

interface CreateOrderInput {
  totalAmount: number;
  items: OrderItemInput[];
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  remark?: string;
}

@Injectable()
export class OrdersService {
  private client = getSupabaseClient();

  async createOrder(input: CreateOrderInput) {
    // 生成订单号
    const orderNumber = `ORD${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // 创建订单
    const { data: order, error: orderError } = await this.client
      .from('orders')
      .insert({
        order_number: orderNumber,
        table_number: input.tableNumber,
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        total_amount: input.totalAmount,
        remark: input.remark,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('创建订单失败:', orderError);
      throw new Error('创建订单失败');
    }

    // 创建订单详情
    const orderItems = input.items.map((item) => ({
      order_id: order.id,
      dish_id: item.dishId,
      dish_name: item.dishName,
      dish_price: item.dishPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
      remark: item.remark,
    }));

    const { error: itemsError } = await this.client
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('创建订单详情失败:', itemsError);
      throw new Error('创建订单详情失败');
    }

    return order;
  }

  async getOrders() {
    // 获取订单列表
    const { data: orders, error: ordersError } = await this.client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (ordersError) {
      console.error('获取订单列表失败:', ordersError);
      throw new Error('获取订单列表失败');
    }

    if (!orders || orders.length === 0) {
      return [];
    }

    // 获取订单详情
    const orderIds = orders.map((order) => order.id);
    const { data: items, error: itemsError } = await this.client
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    if (itemsError) {
      console.error('获取订单详情失败:', itemsError);
      throw new Error('获取订单详情失败');
    }

    // 组装数据
    return orders.map((order) => ({
      ...order,
      items: (items || []).filter((item) => item.order_id === order.id),
    }));
  }

  async getOrderById(id: string) {
    // 获取订单
    const { data: order, error: orderError } = await this.client
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (orderError) {
      console.error('获取订单失败:', orderError);
      throw new Error('获取订单失败');
    }

    if (!order) {
      throw new Error('订单不存在');
    }

    // 获取订单详情
    const { data: items, error: itemsError } = await this.client
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) {
      console.error('获取订单详情失败:', itemsError);
      throw new Error('获取订单详情失败');
    }

    return {
      ...order,
      items: items || [],
    };
  }
}
