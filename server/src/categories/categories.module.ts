import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { DishesService } from '@/dishes/dishes.service';
import { DishesModule } from '@/dishes/dishes.module';

@Module({
  imports: [DishesModule],
  controllers: [CategoriesController],
  providers: [],
  exports: [],
})
export class CategoriesModule {}
