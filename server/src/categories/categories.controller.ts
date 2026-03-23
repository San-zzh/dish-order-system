import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors } from '@nestjs/common';
import { HttpStatusInterceptor } from '@/interceptors/http-status.interceptor';
import { DishesService } from '@/dishes/dishes.service';

@Controller('categories')
@UseInterceptors(HttpStatusInterceptor)
export class CategoriesController {
  constructor(private readonly dishesService: DishesService) {}

  // 获取分类列表
  @Get()
  async getCategories() {
    return {
      code: 200,
      msg: 'success',
      data: await this.dishesService.getCategories(),
    };
  }

  // 创建分类
  @Post()
  async createCategory(@Body() body: any) {
    try {
      return {
        code: 200,
        msg: '分类创建成功',
        data: await this.dishesService.createCategory(body),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '创建分类失败',
        data: null,
      };
    }
  }

  // 更新分类
  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    try {
      return {
        code: 200,
        msg: '分类更新成功',
        data: await this.dishesService.updateCategory(id, body),
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '更新分类失败',
        data: null,
      };
    }
  }

  // 删除分类
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.dishesService.deleteCategory(id);
      return {
        code: 200,
        msg: '分类删除成功',
        data: null,
      };
    } catch (error) {
      return {
        code: 500,
        msg: error instanceof Error ? error.message : '删除分类失败',
        data: null,
      };
    }
  }
}
