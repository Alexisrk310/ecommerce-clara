require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', url);
console.log('Key:', key ? 'PROTECTED' : 'MISSING');

if (!url || !key) {
  console.error('Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) throw error;
    console.log('Connection Successful! Data:', data);
  } catch (err) {
    console.error('Connection Failed:', err.message);
  }
}

test();
