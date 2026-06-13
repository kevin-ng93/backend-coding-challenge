import { z } from 'zod';

export const ResourceStatusSchema = z.enum(['active', 'inactive']);

export const CreateResourceSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    description: z.string().trim().min(1, 'Description is required').max(500),
    category: z.string().trim().min(1, 'Category is required').max(50),
    status: ResourceStatusSchema.default('active'),
  })
  .strict();

export const UpdateResourceSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100).optional(),
    description: z.string().trim().min(1, 'Description is required').max(500).optional(),
    category: z.string().trim().min(1, 'Category is required').max(50).optional(),
    status: ResourceStatusSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

export const ResourceQuerySchema = z
  .object({
    category: z.string().trim().min(1).max(50).optional(),
    status: ResourceStatusSchema.optional(),
    name: z.string().trim().min(1).max(100).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export const ResourceIdSchema = z.object({
  id: z.coerce.number().int().positive('Resource ID must be a positive integer'),
});

export type CreateResourceInput = z.infer<typeof CreateResourceSchema>;
export type UpdateResourceInput = z.infer<typeof UpdateResourceSchema>;
export type ResourceQuery = z.infer<typeof ResourceQuerySchema>;
export type ResourceId = z.infer<typeof ResourceIdSchema>;
