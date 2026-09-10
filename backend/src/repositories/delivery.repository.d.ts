export declare class DeliveryRepository {
    findDriverByUserId(userId: string): Promise<{
        id: string;
        vehicleNo: string | null;
        isAvailable: boolean;
        userId: string;
    } | null>;
    findDeliveriesByDriverId(driverId: string): Promise<({
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
    } & {
        id: string;
        status: string;
        pickupTime: Date | null;
        deliveryTime: Date | null;
        redistributionId: string;
        driverId: string | null;
    })[]>;
    updateDeliveryStatusTransaction(deliveryId: string, status: string): Promise<{
        id: string;
        status: string;
        pickupTime: Date | null;
        deliveryTime: Date | null;
        redistributionId: string;
        driverId: string | null;
    }>;
}
//# sourceMappingURL=delivery.repository.d.ts.map