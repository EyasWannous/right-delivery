import { z } from 'zod';

export const PartnerCreateOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  customerPhone: z.string().min(1, 'Customer phone is required.'),
  fullAddress: z.string().min(1, 'Full address is required.'),
  region: z.string().min(1, 'Region is required.'),
  lat: z.number({ required_error: 'lat is required.' }).min(-90).max(90),
  lng: z.number({ required_error: 'lng is required.' }).min(-180).max(180),
  externalReference: z.string().min(1, 'externalReference is required.'),
});

export const PartnerGetOrderSchema = z.object({
  ref: z.string().min(1, 'ref param is required.'),
});

export type PartnerCreateOrderInput = z.infer<typeof PartnerCreateOrderSchema>;
