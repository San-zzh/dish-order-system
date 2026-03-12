import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { HttpStatusInterceptor } from '@/interceptors/http-status.interceptor';
import { DishesService } from './dishes.service';

@Controller('dishes')
@UseInterceptors(HttpStatusInterceptor)
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  // 获取菜品列表
  @Get()
  async getDishes(@Query('categoryId') categoryId?: string) {
    return {
      code: 200,
      msg: 'success',
      data: await this.dishesService.getDishes(categoryId),
    };
  }

  // 获取菜品详情
  @Get(':id')
  async getDishById(@Param('id') id: string) {
    try {
      return {
        code: 200,
        msg: 'success',
        data: await this.dishesService.getDishById(id),
      };
    } catch (error) {
      return {
        code: 404,
        msg: error instanceof Error ? error.message : '获取菜品详情失败',
        data: null,
      };
    }
  }
}
