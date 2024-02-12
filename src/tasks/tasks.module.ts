// Node Deps
import { Module } from '@nestjs/common'
// Other Modules
import { PrismaModule } from '@/prisma/prisma.module'
// Current Module Deps
import { TasksService } from './tasks.service'

@Module({
  imports: [PrismaModule],
  providers: [
    TasksService
  ]
})
export class TasksModule {}
