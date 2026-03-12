import { Controller, Get, Post, Param, Body, UseInterceptors } from '@nestjs/common';
import { HttpStatusInterceptor } from '@/interceptors/http-status.interceptor';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseInterceptors(HttpStatusInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 创建订单
  @Post()
  async createOrder(@Body() body: { totalAmount: number; items: any[]; remark?: string }) {
    try {
      return {
        code: 200,
        msg: '订单创建成功',
        data: await this.ordersService.createOrder({
          totalAmount: body.totalAmount,
          items: body.items,
          remark: body.remark,
        }),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '创建订单失败',
        data: null,
      };
    }
  }

  // 获取订单列表
  @Get()
  async getOrders() {
    try {
      return {
        code: 200,
        msg: 'success',
        data: await this.ordersService.getOrders(),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '获取订单列表失败',
        data: [],
      };
    }
  }

  // 获取订单详情
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    try {
      return {
        code: 200,
        msg: 'success',
        data: await this.ordersService.getOrderById(id),
      };
    } catch (error) {
      return {
        code: 404,
        msg: error instanceof Error ? error.message : '获取订单详情失败',
        data: null,
      };
    }
  }
}
