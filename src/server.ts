// src/server.ts

import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import combinedDevices from './combinedDevices.json';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'GPS Devices Management API',
    version: '1.0.0',
    description: 'API for managing gps devices',
  },

};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/server.ts'],
};

const swaggerSpec = swaggerJSDoc(options);


const app = express();  
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

interface Device {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: "Seen" | "Missing" | "Repair";
  timestamp: number;
}

function isValidDevice(device: any): device is Device {
  const validStatuses = ["Seen", "Missing", "Repair"];

  return typeof device.id === 'string' &&
         typeof device.name === 'string' &&
         typeof device.location === 'object' &&
         typeof device.location.latitude === 'number' &&
         typeof device.location.longitude === 'number' &&
         validStatuses.includes(device.status) &&
         typeof device.timestamp === 'number';
}

const devices: Device[] = combinedDevices.filter(isValidDevice);

/**
 * @swagger
 * /seenDevices:
 *   get:
 *     summary: Get all seen devices
 *     description: Retrieve a list of devices with status 'Seen'
 *     responses:
 *       200:
 *         description: A list of seen devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */
app.get("/seenDevices", (req: Request, res: Response) => {
  const seenDevices = devices.filter((device, index, self) =>
  index === self.findIndex(d => d.id === device.id && device.status === 'Seen')
);
  res.json(seenDevices);
});

interface StatusCount {
  [key: string]: number;
}

/**
 * @swagger
 * /devicesStatus:
 *   get:
 *     summary: Get the status count of all devices
 *     description: Retrieve a count of devices in each status category
 *     responses:
 *       200:
 *         description: An object with the count of each device status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: integer
 */
app.get("/devicesStatus", (req: Request, res: Response) => {
  const latestStatusMap = new Map();

  // Iterate over the devices to find the most recent status of each
  devices.forEach(device => {
    const existingEntry = latestStatusMap.get(device.id);
    if (!existingEntry || device.timestamp > existingEntry.timestamp) {
      latestStatusMap.set(device.id, device);
    }
  });

  // Initialize status counts with zero for each status
  const statusCounts: Record<string, number> = {
    missing: 0,
    repair: 0,
    seen: 0,
    total: latestStatusMap.size
  };

  // Update the status counts based on the most recent statuses
  latestStatusMap.forEach(device => {
    const status = device.status.toLowerCase();
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status] += 1;
    }
  });

  res.json(statusCounts);
});

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Get all devices
 *     description: Retrieve a list of all devices
 *     responses:
 *       200:
 *         description: A list of devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */
app.get("/devices", (req: Request, res: Response) => {
  res.json(devices);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});