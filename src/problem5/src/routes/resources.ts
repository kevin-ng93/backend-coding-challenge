import { Router } from 'express';
import { validateRequest, validateSchema } from '../middleware/validation';
import {
  CreateResourceSchema,
  ResourceIdSchema,
  ResourceQuerySchema,
  UpdateResourceSchema,
  type ResourceQuery,
} from '../schemas/resource.schema';
import type { ResourceService } from '../services/resource.service';

export default function createResourceRouter(resourceService: ResourceService): Router {
  const router = Router();

  router.post(
    '/',
    validateSchema(CreateResourceSchema, 'body'),
    (req, res) => {
      const resource = resourceService.createResource(req.body);

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: resource,
      });
    }
  );

  router.get(
    '/',
    validateSchema(ResourceQuerySchema, 'query'),
    (req, res) => {
      const query = res.locals.query as ResourceQuery;
      const { resources, total, filters } = resourceService.listResources(query);

      res.json({
        success: true,
        message: 'Resources retrieved successfully',
        data: resources,
        meta: {
          count: resources.length,
          total,
          limit: filters.limit,
          offset: filters.offset,
          filters: {
            category: filters.category,
            status: filters.status,
            name: filters.name,
          },
        },
      });
    }
  );

  router.get(
    '/:id',
    validateSchema(ResourceIdSchema, 'params'),
    (req, res) => {
      const resource = resourceService.getResourceById(Number(req.params.id));

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resource retrieved successfully',
        data: resource,
      });
    }
  );

  router.patch(
    '/:id',
    validateRequest([
      { schema: ResourceIdSchema, target: 'params' },
      { schema: UpdateResourceSchema, target: 'body' },
    ]),
    (req, res) => {
      const resource = resourceService.updateResource(Number(req.params.id), req.body);

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resource updated successfully',
        data: resource,
      });
    }
  );

  router.delete(
    '/:id',
    validateSchema(ResourceIdSchema, 'params'),
    (req, res) => {
      const deleted = resourceService.deleteResource(Number(req.params.id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resource deleted successfully',
      });
    }
  );

  return router;
}
