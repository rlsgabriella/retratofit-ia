import 'dotenv/config';

export const env = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  geminiApiKey: process.env.GEMINI_API_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
};

const required = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'GEMINI_API_KEY', 'CLERK_SECRET_KEY'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
}
