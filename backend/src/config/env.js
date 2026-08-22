const { z } = require('zod');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().url().default('mongodb://localhost:27017/academia_industry_platform'),
  JWT_ACCESS_SECRET: z.string().default('default_access_secret_key_change_me_in_prod'),
  JWT_REFRESH_SECRET: z.string().default('default_refresh_secret_key_change_me_in_prod'),
  JWT_ACCESS_EXPIRATION_MINUTES: z.string().default('15'),
  JWT_REFRESH_EXPIRATION_DAYS: z.string().default('30'),
  HUGGINGFACE_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

module.exports = _env.data;
