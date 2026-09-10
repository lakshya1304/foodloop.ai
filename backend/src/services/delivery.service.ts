import { DeliveryRepository } from '../repositories/delivery.repository';
import { DeliveryStatusInput } from '../schemas/delivery.schema';

const deliveryRepo = new DeliveryRepository();

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return d;
}

export class DeliveryService {
  async getDeliveries(user: any) {
    if (user.role !== 'DRIVER') {
      throw new Error('Unauthorized');
    }

    const driver = await deliveryRepo.findDriverByUserId(user.id);
    if (!driver) throw new Error('Driver profile not found');

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

  async updateDeliveryStatus(deliveryId: string, input: DeliveryStatusInput) {
    return deliveryRepo.updateDeliveryStatusTransaction(deliveryId, input.status);
  }
}
