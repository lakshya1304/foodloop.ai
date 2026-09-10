import { Prisma } from '@prisma/client';
export declare class InventoryRepository {
    findManyByKitchenId(kitchenId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiryDate: Date | null;
        kitchenId: string;
        unit: string;
        status: string;
        productName: string;
        category: string;
        quantity: number;
        batchNumber: string | null;
        barcode: string | null;
        manufacturingDate: Date | null;
        storageLocation: string | null;
        storageTemperature: number | null;
    }[]>;
    create(data: Prisma.InventoryItemUncheckedCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiryDate: Date | null;
        kitchenId: string;
        unit: string;
        status: string;
        productName: string;
        category: string;
        quantity: number;
        batchNumber: string | null;
        barcode: string | null;
        manufacturingDate: Date | null;
        storageLocation: string | null;
        storageTemperature: number | null;
    }>;
}
//# sourceMappingURL=inventory.repository.d.ts.map