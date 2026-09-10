import { InventoryInput } from '../schemas/inventory.schema';
export declare class InventoryService {
    getInventory(user: any): Promise<{
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
    createInventoryItem(user: any, input: InventoryInput): Promise<{
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
//# sourceMappingURL=inventory.service.d.ts.map