// Ensures tests always run against the deterministic mock AI path,
// regardless of what's in the developer's local .env file.
process.env.GEMINI_API_KEY = '';
process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';
