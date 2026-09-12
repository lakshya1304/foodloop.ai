import { PrismaClient } from '@prisma/client';
import { ProductionRepository } from '../repositories/production.repository';
import { ProdInput, ConsInput } from '../schemas/production.schema';
import { io } from '../socket';

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

    const result = await prodRepo.consumeAndCalculateSurplus(kitchen.id, input.foodItem, input.quantityConsumed, input.unit);
    
    // Broadcast live event to NGOs and Admins if there is surplus
    if (result && result.quantitySurplus > 0 && io) {
      io.to('role_NGO_STAFF').emit('notification', { 
        title: 'New Surplus Available', 
        message: `${result.quantitySurplus}${result.unit} of ${result.foodItem} is available from ${kitchen.name}!` 
      });
      io.to('role_ADMIN').emit('notification', { 
        title: 'System Activity', 
        message: `Surplus recorded at ${kitchen.name}` 
      });
      io.emit('surplus_updated');
    }
    
    return result;
  }
}
