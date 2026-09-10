import { ProdInput, ConsInput } from '../schemas/production.schema';
export declare class ProductionService {
    recordProduction(user: any, input: ProdInput): Promise<{
        id: string;
        kitchenId: string;
        date: Date;
        foodItem: string;
        quantityProduced: number;
        unit: string;
    }>;
    consumeAndCalculateSurplus(user: any, input: ConsInput): Promise<{
        consumption: {
            id: string;
            kitchenId: string;
            date: Date;
            foodItem: string;
            unit: string;
            quantityConsumed: number;
        };
        surplus: {
            id: string;
            kitchenId: string;
            date: Date;
            foodItem: string;
            unit: string;
            quantitySurplus: number;
            status: string;
        } | null;
    }>;
}
//# sourceMappingURL=production.service.d.ts.map