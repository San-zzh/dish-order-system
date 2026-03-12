import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DishesModule } from '@/dishes/dishes.module';
import { CategoriesModule } from '@/categories/categories.module';
import { OrdersModule } from '@/orders/orders.module';

@Module({
  imports: [DishesModule, CategoriesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
