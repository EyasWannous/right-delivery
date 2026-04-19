import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform((v) => parseInt(v, 10)),
  MONGODB_URI: z.string().url({ message: 'MONGODB_URI must be a valid URL' }),
  JWT_SECRET: z.string().min(16, { message: 'JWT_SECRET must be at least 16 characters' }),
  PARTNER_API_KEY: z.string().min(1, { message: 'PARTNER_API_KEY is required' }),
});

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error('Invalid environment variables:\n', _parsed.error.format());
  process.exit(1);
}

export const env = _parsed.data;

export type Env = z.infer<typeof envSchema>;
