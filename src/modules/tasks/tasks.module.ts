import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}
