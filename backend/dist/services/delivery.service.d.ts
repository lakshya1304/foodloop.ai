import { DeliveryStatusInput } from '../schemas/delivery.schema';
export declare class DeliveryService {
    getDeliveries(user: any): Promise<any[]>;
    updateDeliveryStatus(deliveryId: string, input: DeliveryStatusInput): Promise<{
        id: string;
        status: string;
        redistributionId: string;
        driverId: string | null;
        pickupTime: Date | null;
        deliveryTime: Date | null;
    }>;
}
//# sourceMappingURL=delivery.service.d.ts.map