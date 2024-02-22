// Node Deps
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import moment from 'moment'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  // @Cron('* 12 * * * *')
  // async clearExpiredTokens () {
  //   const currentDate = moment().toISOString()
  //
  //   await this.prisma
  //     .apiTokens
  //     .deleteMany({
  //       where: {
  //         expires_at: {
  //           lt: currentDate
  //         }
  //       }
  //     })
  //
  //   console.log('All Expired tokens are deleted')
  // }
}
