export declare class ProductionRepository {
    recordProduction(kitchenId: string, foodItem: string, quantityProduced: number, unit: string): Promise<{
        id: string;
        kitchenId: string;
        date: Date;
        foodItem: string;
        quantityProduced: number;
        unit: string;
    }>;
    consumeAndCalculateSurplus(kitchenId: string, foodItem: string, quantityConsumed: number, unit: string): Promise<{
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
//# sourceMappingURL=production.repository.d.ts.map