import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Example API endpoint
app.get('/api/events', (req: Request, res: Response) => {
  // Mock events data
  res.json([
    {
      id: 1,
      title: 'JAIA General Meeting',
      location: 'Zoom',
      description: 'We will be discussing upcoming events and our new realtime lawbot. Join us for this exciting meeting.',
      date: '13th April 2025, 8pm - 9pm EST'
    },
    {
      id: 2,
      title: 'JAIA Workshop',
      location: 'Discord',
      description: 'Join us for our first meeting of the year as we discuss plans going forward and events we have planned.',
      date: '19th April 2025, 8pm'
    }
  ]);
});

// In production, serve the static files from the React app
if (!isDev) {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // All other requests return the React app (handle client-side routing)
  app.use((req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  if (isDev) {
    console.log('📝 Development mode - API only');
  } else {
    console.log('🎉 Production mode - Serving frontend');
  }
});
// Force rebuild
