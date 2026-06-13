import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { Database } from './database/database';
import createResourceRouter from './routes/resources';
import { ResourceServiceImpl, type ResourceService } from './services/resource.service';

export function createApp(resourceService?: ResourceService): express.Express {
  const app = express();
  const service = resourceService ?? new ResourceServiceImpl(new Database());

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'ExpressJS TypeScript CRUD API',
      endpoints: {
        create: 'POST /api/resources',
        list: 'GET /api/resources',
        get: 'GET /api/resources/:id',
        update: 'PUT /api/resources/:id',
        delete: 'DELETE /api/resources/:id',
      },
    });
  });

  app.use('/api/resources', createResourceRouter(service));

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
    });
  });

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof SyntaxError) {
      res.status(400).json({
        success: false,
        message: 'Invalid JSON body',
      });
      return;
    }

    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  };

  app.use(errorHandler);

  return app;
}

const app = createApp();

export default app;
