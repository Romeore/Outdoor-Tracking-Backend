// src/server.ts

import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());

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

app.get("/seenDevices", (req: Request, res: Response) => {
  const seenDevices = devices.filter(device => device.status === "Seen");

  res.json(seenDevices);
});

app.get("/devices", (req: Request, res: Response) => {
  res.json(devices);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
