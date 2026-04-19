import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '@/domain/shared/errors/DomainErrors';

type RequestSection = 'body' | 'query' | 'params';

export function validate(schema: AnyZodObject, section: RequestSection = 'body'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[section]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const message = zodError.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');

      next(new ValidationError(message));
      return;
    }

    (req as unknown as Record<string, unknown>)[section] = result.data;
    next();
  };
}
