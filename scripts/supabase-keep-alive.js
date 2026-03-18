const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function ping() {
  const { error } = await supabase.rpc('ping');
  if (error) {
    console.error('Ping failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Supabase keepalive ping successful!');
  process.exit(0);
}

ping();
