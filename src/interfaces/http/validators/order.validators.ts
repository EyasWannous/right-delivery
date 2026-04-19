import { z } from 'zod';

export const CreateOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  customerPhone: z.string().min(1, 'Customer phone is required.'),
  fullAddress: z.string().min(1, 'Full address is required.'),
  region: z.string().min(1, 'Region is required.'),
  lat: z.number({ required_error: 'lat is required.' }).min(-90).max(90),
  lng: z.number({ required_error: 'lng is required.' }).min(-180).max(180),
  externalReference: z.string().optional(),
});

export const UpdateOrderSchema = z
  .object({
    customerName: z.string().min(1).optional(),
    fullAddress: z.string().min(1).optional(),
    region: z.string().min(1).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
  })
  .refine(
    (data) => {
      const hasLat = data.lat !== undefined;
      const hasLng = data.lng !== undefined;
      return hasLat === hasLng;
    },
    { message: 'Both lat and lng must be provided together.' },
  );

export const ListOrdersSchema = z.object({
  status: z.enum(['created', 'assigned', 'picked_up', 'delivered', 'cancelled']).optional(),
  region: z.string().optional(),
  captainId: z.string().optional(),
  assignmentState: z.enum(['assigned', 'unassigned']).optional(),
  dateFrom: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid dateFrom format.',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  dateTo: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid dateTo format.',
    })
    .transform((val) => (val ? new Date(val) : undefined)),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
});

export const AssignCaptainSchema = z.object({
  captainId: z.string().min(1, 'captainId is required.'),
});

export const UpdateOrderStatusSchema = z.object({
  action: z.enum(['mark_picked_up', 'mark_delivered'], {
    required_error: 'action is required.',
    invalid_type_error: "action must be 'mark_picked_up' or 'mark_delivered'.",
  }),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type ListOrdersInput = z.infer<typeof ListOrdersSchema>;
export type AssignCaptainInput = z.infer<typeof AssignCaptainSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
