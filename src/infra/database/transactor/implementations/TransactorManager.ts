import { Injectable } from '@nestjs/common'
import {
  PrismaContext,
  PrismaService,
} from '@infra/database/prisma/Prisma.service'
import { Transaction, Transactor } from '../entities/Transactor'
import { TransactorService } from '../contracts/Transactor.service'

/**
 * @class TransactorManager - It will be responsible for managing transactions using the Prisma Client at context execution
 */
@Injectable()
export class TransactorManager implements TransactorService<PrismaContext> {
  constructor(private readonly prisma: PrismaService) {}

  start(): Transactor<PrismaContext> {
    return Transactor.create<PrismaContext>({
      transactions: [],
    })
  }

  async execute(transactor: Transactor<PrismaContext>): Promise<unknown[]> {
    const responses: unknown[] = []

    async function executeTransactions(
      transactions: Transaction<PrismaContext>[],
      config: PrismaContext,
    ) {
      const transaction = transactions.shift()

      if (transaction) {
        const result = await transaction(config)
        responses.push(result)
        await executeTransactions(transactions, config)
      }
    }

    return await this.prisma.$transaction(async (prisma) => {
      await executeTransactions(transactor.transactions, { prisma })
      return responses
    })
  }
}
