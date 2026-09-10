import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductionRepository {
  async recordProduction(kitchenId: string, foodItem: string, quantityProduced: number, unit: string) {
    return prisma.productionRecord.create({
      data: {
        kitchenId,
        foodItem,
        quantityProduced,
        unit
      }
    });
  }

  async consumeAndCalculateSurplus(kitchenId: string, foodItem: string, quantityConsumed: number, unit: string) {
    const today = new Date();
    today.setHours(0,0,0,0);

    return prisma.$transaction(async (tx) => {
      // 1. Record consumption
      const cons = await tx.consumptionRecord.create({
        data: {
          kitchenId,
          foodItem,
          quantityConsumed,
          unit
        }
      });

      // 2. Find production
      const prods = await tx.productionRecord.findMany({
        where: { kitchenId, foodItem, date: { gte: today } }
      });
      const totalProduced = prods.reduce((sum, p) => sum + p.quantityProduced, 0);

      // 3. Calculate surplus
      const surplusQuantity = totalProduced - quantityConsumed;
      let surplus = null;

      if (surplusQuantity > 0) {
        surplus = await tx.surplus.create({
          data: {
            kitchenId,
            foodItem,
            quantitySurplus: surplusQuantity,
            unit,
            status: 'AVAILABLE'
          }
        });
      }

      return { consumption: cons, surplus };
    });
  }
}
