import { PrismaClient } from '@prisma/client';
import { InventoryRepository } from '../repositories/inventory.repository';
import { InventoryInput } from '../schemas/inventory.schema';

const prisma = new PrismaClient();
const inventoryRepo = new InventoryRepository();

export class InventoryService {
  async getInventory(user: any) {
    let kitchenId;
    if (user.role === 'KITCHEN_MANAGER') {
      const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId }});
      if (!kitchen) throw new Error('Kitchen not found for org');
      kitchenId = kitchen.id;
    }

    return inventoryRepo.findManyByKitchenId(kitchenId);
  }

  async createInventoryItem(user: any, input: InventoryInput) {
    if (user.role !== 'KITCHEN_MANAGER' && user.role !== 'ADMIN') {
      throw new Error('Unauthorized');
    }

    const kitchen = await prisma.kitchen.findFirst({ where: { organizationId: user.organizationId }});
    if (!kitchen) throw new Error('Kitchen not found for org');

    return inventoryRepo.create({
      kitchenId: kitchen.id,
      productName: input.productName,
      category: input.category,
      quantity: input.quantity,
      unit: input.unit,
      batchNumber: input.batchNumber ?? null,
      barcode: input.barcode ?? null,
      manufacturingDate: input.manufacturingDate ? new Date(input.manufacturingDate) : null,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      storageLocation: input.storageLocation ?? null,
      status: 'SAFE'
    });
  }
}
