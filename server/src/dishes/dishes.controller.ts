import { Controller, Get, Post, Put, Delete, Query, Param, Body, UseInterceptors } from '@nestjs/common';
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

  // 创建菜品
  @Post()
  async createDish(@Body() body: any) {
    try {
      return {
        code: 200,
        msg: '菜品创建成功',
        data: await this.dishesService.createDish(body),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '创建菜品失败',
        data: null,
      };
    }
  }

  // 更新菜品
  @Put(':id')
  async updateDish(@Param('id') id: string, @Body() body: any) {
    try {
      return {
        code: 200,
        msg: '菜品更新成功',
        data: await this.dishesService.updateDish(id, body),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '更新菜品失败',
        data: null,
      };
    }
  }

  // 删除菜品
  @Delete(':id')
  async deleteDish(@Param('id') id: string) {
    try {
      await this.dishesService.deleteDish(id);
      return {
        code: 200,
        msg: '菜品删除成功',
        data: null,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '删除菜品失败',
        data: null,
      };
    }
  }
}
