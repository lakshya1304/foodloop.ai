"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const delivery_repository_1 = require("../repositories/delivery.repository");
const deliveryRepo = new delivery_repository_1.DeliveryRepository();
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}
class DeliveryService {
    async getDeliveries(user) {
        if (user.role !== 'DRIVER') {
            throw new Error('Unauthorized');
        }
        const driver = await deliveryRepo.findDriverByUserId(user.id);
        if (!driver)
            throw new Error('Driver profile not found');
        const deliveries = await deliveryRepo.findDeliveriesByDriverId(driver.id);
        return deliveries.map(d => {
            let distanceKm = 12; // Default mock
            let timeMins = 25;
            const kitchenLat = d.redistribution?.surplus?.kitchen?.latitude;
            const kitchenLng = d.redistribution?.surplus?.kitchen?.longitude;
            const ngoLat = d.redistribution?.ngo?.latitude;
            const ngoLng = d.redistribution?.ngo?.longitude;
            if (kitchenLat && kitchenLng && ngoLat && ngoLng) {
                distanceKm = Math.round(getDistanceFromLatLonInKm(kitchenLat, kitchenLng, ngoLat, ngoLng) * 10) / 10;
                timeMins = Math.round(distanceKm * 2);
            }
            return {
                ...d,
                calculatedRoute: {
                    distanceText: `${distanceKm} km`,
                    durationText: `${timeMins} mins`
                }
            };
        });
    }
    async updateDeliveryStatus(deliveryId, input) {
        return deliveryRepo.updateDeliveryStatusTransaction(deliveryId, input.status);
    }
}
exports.DeliveryService = DeliveryService;
//# sourceMappingURL=delivery.service.js.map