export declare class NgoRepository {
    findAvailableSurplus(): Promise<({
        kitchen: {
            id: string;
            name: string;
            organizationId: string;
            location: string;
            latitude: number | null;
            longitude: number | null;
        };
    } & {
        id: string;
        kitchenId: string;
        date: Date;
        foodItem: string;
        unit: string;
        quantitySurplus: number;
        status: string;
    })[]>;
    getDashboardStats(ngoId: string): Promise<{
        acceptedToday: number;
        pendingArrival: number;
    }>;
    acceptSurplusTransaction(surplusId: string, quantityRequested: number, ngoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        quantityMatched: number;
        surplusId: string;
        ngoId: string;
    }>;
}
//# sourceMappingURL=ngo.repository.d.ts.map