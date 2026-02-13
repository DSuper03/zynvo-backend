import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

console.log('📁 Loading .env from:', envPath);
