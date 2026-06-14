import cors, { type CorsOptions } from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import { Database } from './database/database';
import createResourceRouter from './routes/resources';
import { ResourceServiceImpl, type ResourceService } from './services/resource.service';

const defaultDevelopmentCorsOrigins = ['http://localhost:3000', 'http://localhost:5173'];

function parseCorsOrigins(value: string | undefined): string[] {
  return (
    value
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []
  );
}

export function createCorsOptions(): CorsOptions {
  const configuredOrigins = parseCorsOrigins(process.env.CORS_ORIGINS);
  const allowedOrigins =
    configuredOrigins.length > 0
      ? configuredOrigins
      : process.env.NODE_ENV === 'production'
        ? []
        : defaultDevelopmentCorsOrigins;

  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  };
}

export function createApp(resourceService?: ResourceService): express.Express {
  const app = express();
  const service = resourceService ?? new ResourceServiceImpl(new Database());

  app.use(helmet());
  app.use(cors(createCorsOptions()));
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
        update: 'PATCH /api/resources/:id',
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
