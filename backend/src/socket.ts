import { Server, Socket } from 'socket.io';
import { FastifyInstance } from 'fastify';

let ioInstance: Server | null = null;

export function getIO(): Server | null {
  return ioInstance;
}

export function setupSocket(server: FastifyInstance) {
  ioInstance = new Server(server.server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  ioInstance.on('connection', (socket: Socket) => {
    server.log.info(`[Socket.io] Client connected: ${socket.id}`);

    // Helper for standardized socket responses
    const handleSocketRPC = async (
      eventName: string,
      cb: any,
      actionFn: () => Promise<any>
    ) => {
      try {
        const result = await actionFn();
        const response = { success: true, data: result };
        socket.emit(`${eventName}:response`, response);
        if (typeof cb === 'function') cb(response);
      } catch (err: any) {
        const errorResponse = { success: false, message: err.message || 'Error processing request' };
        socket.emit(`${eventName}:error`, errorResponse);
        if (typeof cb === 'function') cb(errorResponse);
      }
    };

    // System & Health Endpoints over Socket
    socket.on('ping', (data, cb) => {
      const response = { status: 'pong', timestamp: new Date().toISOString() };
      socket.emit('pong', response);
      if (typeof cb === 'function') cb(response);
    });

    socket.on('health', (data, cb) => {
      const response = { status: 'ok', service: 'FoodLoop Backend API', timestamp: new Date().toISOString() };
      socket.emit('health:response', response);
      if (typeof cb === 'function') cb(response);
    });

    // Inventory Endpoints over Socket
    socket.on('inventory:get', (user, cb) => {
      handleSocketRPC('inventory:get', cb, async () => {
        const { InventoryService } = require('./services/inventory.service');
        return new InventoryService().getInventory(user || { role: 'ADMIN' });
      });
    });

    socket.on('inventory:create', ({ user, input }, cb) => {
      handleSocketRPC('inventory:create', cb, async () => {
        const { InventoryService } = require('./services/inventory.service');
        const item = await new InventoryService().createInventoryItem(user, input);
        ioInstance?.emit('inventory_updated', item);
        return item;
      });
    });

    // Production Endpoints over Socket
    socket.on('production:record', ({ user, input }, cb) => {
      handleSocketRPC('production:record', cb, async () => {
        const { ProductionService } = require('./services/production.service');
        const record = await new ProductionService().recordProduction(user, input);
        ioInstance?.emit('production_updated', record);
        return record;
      });
    });

    socket.on('production:consume', ({ user, input }, cb) => {
      handleSocketRPC('production:consume', cb, async () => {
        const { ProductionService } = require('./services/production.service');
        const result = await new ProductionService().consumeAndCalculateSurplus(user, input);
        ioInstance?.emit('surplus_updated', result);
        return result;
      });
    });

    // Delivery & Logistics Endpoints over Socket
    socket.on('delivery:get', (user, cb) => {
      handleSocketRPC('delivery:get', cb, async () => {
        const { DeliveryService } = require('./services/delivery.service');
        return new DeliveryService().getDeliveries(user || { role: 'DRIVER', id: 'driver-1' });
      });
    });

    socket.on('delivery:update_status', ({ deliveryId, status }, cb) => {
      handleSocketRPC('delivery:update_status', cb, async () => {
        const { DeliveryService } = require('./services/delivery.service');
        const updated = await new DeliveryService().updateDeliveryStatus(deliveryId, { status });
        ioInstance?.emit('delivery_updated', { deliveryId, status });
        return updated;
      });
    });

    // Sensors Endpoint over Socket
    socket.on('sensor:get', (data, cb) => {
      handleSocketRPC('sensor:get', cb, async () => {
        return {
          temperature: (3.5 + Math.random() * 0.4).toFixed(1),
          humidity: Math.round(62 + Math.random() * 3),
          gasLevelPpm: Math.round(180 + Math.random() * 10),
          status: 'OPTIMAL',
          timestamp: new Date().toISOString()
        };
      });
    });

    // AI & Analytics Endpoints over Socket
    socket.on('ai:recommendations', (kitchenId, cb) => {
      handleSocketRPC('ai:recommendations', cb, async () => {
        const { AiService } = require('./services/ai.service');
        return new AiService().getRecommendations(kitchenId);
      });
    });

    socket.on('ai:predict_demand', (input, cb) => {
      handleSocketRPC('ai:predict_demand', cb, async () => {
        const { AiService } = require('./services/ai.service');
        return new AiService().demandPrediction(input);
      });
    });

    socket.on('disconnect', () => {
      server.log.info(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  server.decorate('io', ioInstance);
}

export { ioInstance as io };


