import type { NextFunction, Request, Response } from 'express';
import { ZodError, type z } from 'zod';

type RequestTarget = 'body' | 'params' | 'query';

export function validateSchema<T>(schema: z.ZodSchema<T>, target: RequestTarget) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = target === 'body' ? req.body : target === 'params' ? req.params : req.query;
      const validatedData = schema.parse(data);

      if (target === 'body') {
        req.body = validatedData;
      } else if (target === 'params') {
        req.params = validatedData as Request['params'];
      } else {
        res.locals.query = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.') || target,
            message: issue.message,
          })),
        });
        return;
      }

      next(error);
    }
  };
}

export function validateRequest(validations: Array<{ schema: z.ZodSchema; target: RequestTarget }>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ field: string; message: string }> = [];

    for (const validation of validations) {
      const data =
        validation.target === 'body'
          ? req.body
          : validation.target === 'params'
            ? req.params
            : req.query;
      const result = validation.schema.safeParse(data);

      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: `${validation.target}.${issue.path.join('.') || validation.target}`,
            message: issue.message,
          }))
        );
        continue;
      }

      if (validation.target === 'body') {
        req.body = result.data;
      } else if (validation.target === 'params') {
        req.params = result.data as Request['params'];
      } else {
        res.locals.query = result.data;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
}
