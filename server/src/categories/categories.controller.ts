import { Controller, Get, UseInterceptors } from '@nestjs/common';
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
}
