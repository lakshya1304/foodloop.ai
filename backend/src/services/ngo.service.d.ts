import { AcceptSurplusInput } from '../schemas/ngo.schema';
export declare class NgoService {
    getAvailableSurplus(): Promise<({
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
    getDashboardStats(user: any): Promise<{
        acceptedToday: number;
        pendingArrival: number;
    }>;
    acceptSurplus(user: any, input: AcceptSurplusInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        quantityMatched: number;
        surplusId: string;
        ngoId: string;
    }>;
}
//# sourceMappingURL=ngo.service.d.ts.map