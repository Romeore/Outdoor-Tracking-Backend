// src/server.ts

import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

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

const devices: Device[] = [
  {
    id: "1",
    name: "Device 1",
    location: {
      latitude: 51.1614,
      longitude: 4.9654,
    },
    status: "Seen",
    timestamp:0.00,
  },
  {
    id: "2",
    name: "Device 2",
    location: {
      latitude: 51.1624,
      longitude: 4.9644,
    },
    status: "Seen",
    timestamp:0.00,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: -1, longitude: -1 },
    status: "Missing",
    timestamp:0.00,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: 41, longitude: 40 },
    status: "Seen",
    timestamp:1.00,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: 42, longitude: 40 },
    status: "Seen",
    timestamp:2.00,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: 43, longitude: 40 },
    status: "Seen",
    timestamp:3.00,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: -1, longitude: -1 },
    status: "Missing",
    timestamp:3.12,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: -1, longitude: -1 },
    status: "Repair",
    timestamp:3.3,
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: -1, longitude: -1 },
    status: "Repair",
    timestamp:4,
  },
  {
    id: "4",
    name: "Device 4",
    location: { latitude: -1, longitude: -1 },
    status: "Repair",
    timestamp:0.00
  },
];

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
  const seenDevices = devices.filter((device) => device.status === "Seen");

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