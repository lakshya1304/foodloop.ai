"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function simulateIoT() {
    console.log('Starting IoT Storage Condition Simulator...');
    // Get an inventory item to monitor
    const items = await prisma.inventoryItem.findMany({ take: 5 });
    if (items.length === 0) {
        console.log('No inventory items found. Exiting.');
        return;
    }
    setInterval(async () => {
        for (const item of items) {
            // Simulate temperature fluctuation (e.g., between 2°C and 8°C for refrigeration)
            const currentTemp = (Math.random() * 10).toFixed(1);
            const isAlert = parseFloat(currentTemp) > 5; // Alert if above 5°C
            console.log(`[IoT Sensor] Item: ${item.productName} | Temp: ${currentTemp}°C | Status: ${isAlert ? 'ALERT ⚠️' : 'OK'}`);
            if (isAlert) {
                await prisma.notification.create({
                    data: {
                        userId: item.kitchenId,
                        title: 'Storage Temperature Alert',
                        message: `Temperature for ${item.productName} has exceeded safe limits (${currentTemp}°C).`,
                        read: false,
                    }
                });
            }
        }
    }, 10000); // Check every 10 seconds
}
simulateIoT()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=iot-simulator.js.map