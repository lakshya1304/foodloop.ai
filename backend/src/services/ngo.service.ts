import { PrismaClient } from '@prisma/client';
import { NgoRepository } from '../repositories/ngo.repository';
import { AcceptSurplusInput } from '../schemas/ngo.schema';

const prisma = new PrismaClient();
const ngoRepo = new NgoRepository();

export class NgoService {
  async getAvailableSurplus() {
    return ngoRepo.findAvailableSurplus();
  }

  async getDashboardStats(user: any) {
    if (user.role !== 'NGO_STAFF') {
      throw new Error('Unauthorized');
    }

    if (!user.organizationId) {
      throw new Error('NGO not found');
    }

    const ngo = await prisma.nGO.findFirst({ where: { organizationId: user.organizationId }});
    if (!ngo) throw new Error('NGO not found');

    return ngoRepo.getDashboardStats(ngo.id);
  }

  async acceptSurplus(user: any, input: AcceptSurplusInput) {
    if (user.role !== 'NGO_STAFF') {
      throw new Error('Unauthorized');
    }

    if (!user.organizationId) {
      throw new Error('NGO not found');
    }

    const ngo = await prisma.nGO.findFirst({ where: { organizationId: user.organizationId }});
    if (!ngo) throw new Error('NGO not found');

    return ngoRepo.acceptSurplusTransaction(input.surplusId, input.quantityRequested, ngo.id);
  }
}
