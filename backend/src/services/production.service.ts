import { PrismaClient } from '@prisma/client';
import { ProductionRepository } from '../repositories/production.repository';
import { ProdInput, ConsInput } from '../schemas/production.schema';

const prisma = new PrismaClient();
const prodRepo = new ProductionRepository();

export class ProductionService {
  async recordProduction(user: any, input: ProdInput) {
    if (!user.organizationId) throw new Error('Kitchen not found');
    const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId }});
    if (!kitchen) throw new Error('Kitchen not found');

    return prodRepo.recordProduction(kitchen.id, input.foodItem, input.quantityProduced, input.unit);
  }

  async consumeAndCalculateSurplus(user: any, input: ConsInput) {
    if (!user.organizationId) throw new Error('Kitchen not found');
    const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId }});
    if (!kitchen) throw new Error('Kitchen not found');

    return prodRepo.consumeAndCalculateSurplus(kitchen.id, input.foodItem, input.quantityConsumed, input.unit);
  }
}
