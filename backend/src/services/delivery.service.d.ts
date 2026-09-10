import { DeliveryStatusInput } from '../schemas/delivery.schema';
export declare class DeliveryService {
    getDeliveries(user: any): Promise<{
        calculatedRoute: {
            distanceText: string;
            durationText: string;
        };
        redistribution: {
            surplus: {
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
            };
            ngo: {
                id: string;
                name: string;
                organizationId: string;
                location: string;
                latitude: number | null;
                longitude: number | null;
                capacity: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            quantityMatched: number;
            surplusId: string;
            ngoId: string;
        };
        id: string;
        status: string;
        pickupTime: Date | null;
        deliveryTime: Date | null;
        redistributionId: string;
        driverId: string | null;
    }[]>;
    updateDeliveryStatus(deliveryId: string, input: DeliveryStatusInput): Promise<{
        id: string;
        status: string;
        pickupTime: Date | null;
        deliveryTime: Date | null;
        redistributionId: string;
        driverId: string | null;
    }>;
}
//# sourceMappingURL=delivery.service.d.ts.map