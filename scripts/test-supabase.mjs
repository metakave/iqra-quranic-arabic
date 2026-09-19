import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Check .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
let envVars = {};

if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      envVars[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || envVars.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY;

console.log('🔍 Checking Supabase Configuration...');
console.log('-------------------------------------------');

if (!supabaseUrl) {
  console.error('❌ Missing URL: NEXT_PUBLIC_SUPABASE_URL is not set.');
} else {
  console.log(`✅ Supabase URL found: ${supabaseUrl}`);
}

if (!supabaseAnonKey) {
  console.error('❌ Missing Anon Key: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.');
} else {
  console.log(`✅ Supabase Anon Key found: ${supabaseAnonKey.slice(0, 15)}...${supabaseAnonKey.slice(-5)}`);
}

if (supabaseUrl && supabaseAnonKey) {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.warn('⚠️ Supabase responded with warning/error on getSession:', error.message);
    } else {
      console.log('🎉 Successfully connected to Supabase Auth API!');
    }
  } catch (err) {
    console.error('❌ Network error connecting to Supabase:', err.message);
  }
}
console.log('-------------------------------------------');
