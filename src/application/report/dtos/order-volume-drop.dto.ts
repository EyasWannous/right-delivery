import { z } from 'zod';

const dateString = z
  .string({ required_error: 'Date is required.' })
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format. Use ISO 8601 (e.g. 2024-01-01 or 2024-01-01T00:00:00Z).',
  })
  .transform((val) => new Date(val));

export const OrderVolumeDropQuerySchema = z
  .object({
    previousFrom: dateString,
    previousTo: dateString,
    currentFrom: dateString,
    currentTo: dateString,
    minPreviousOrders: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1, 'minPreviousOrders must be at least 1.')),
    minDropPercentage: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? parseFloat(val) : 0))
      .pipe(z.number().min(0).max(100, 'minDropPercentage must be between 0 and 100.')),
    page: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1, 'page must be at least 1.')),
    limit: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? parseInt(val, 10) : 20))
      .pipe(z.number().int().min(1).max(100, 'limit must be between 1 and 100.')),
    sortBy: z
      .enum(['dropPercentage', 'dropCount', 'previousOrders', 'currentOrders'])
      .optional()
      .default('dropPercentage'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  })
  .superRefine((data, ctx) => {
    if (data.previousFrom >= data.previousTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['previousTo'],
        message: 'previousTo must be after previousFrom.',
      });
    }

    if (data.currentFrom >= data.currentTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currentTo'],
        message: 'currentTo must be after currentFrom.',
      });
    }

    if (data.previousTo >= data.currentFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currentFrom'],
        message: 'Time periods must not overlap. currentFrom must be after previousTo.',
      });
    }
  });

export type OrderVolumeDropQuery = z.infer<typeof OrderVolumeDropQuerySchema>;

export interface OrderVolumeDropItemDto {
  captainId: string;
  captainName: string;
  previousOrders: number;
  currentOrders: number;
  dropCount: number;
  dropPercentage: number;
}

export interface OrderVolumeDropResponseDto {
  data: OrderVolumeDropItemDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
