// src/server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

interface Device {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'Seen' | 'Missing' | 'Repair';
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
  ];

app.get('/devices', (req: Request, res: Response) => {
  res.json(devices);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
