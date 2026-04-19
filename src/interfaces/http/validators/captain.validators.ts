import { z } from 'zod';

export const CreateCaptainSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  phone: z.string().min(1, 'Phone is required.'),
  vehicleType: z.string().min(1, 'Vehicle type is required.'),
});

export const UpdateCaptainSchema = z
  .object({
    name: z.string().min(1).optional(),
    vehicleType: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.',
  });

export const ListCaptainsSchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
  availability: z.enum(['online', 'offline']).optional(),
});

export type CreateCaptainInput = z.infer<typeof CreateCaptainSchema>;
export type UpdateCaptainInput = z.infer<typeof UpdateCaptainSchema>;
export type ListCaptainsInput = z.infer<typeof ListCaptainsSchema>;
