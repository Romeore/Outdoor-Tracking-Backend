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
  },
  {
    id: "2",
    name: "Device 2",
    location: {
      latitude: 51.1624,
      longitude: 4.9644,
    },
    status: "Seen",
  },
  {
    id: "3",
    name: "Device 3",
    location: { latitude: -1, longitude: -1 },
    status: "Missing",
  },
  {
    id: "4",
    name: "Device 4",
    location: { latitude: -1, longitude: -1 },
    status: "Repair",
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
  const statusCounts: Record<string, number> = devices.reduce<StatusCount>(
    (acc: StatusCount, item) => {
      const status = item.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1; // Increment the count for the current status
      return acc;
    },
    { total: devices.length } // Add the total to the beginning.
  );

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