import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAddressTable() {
  try {
    // Get table structure
    console.log('Checking addresses table structure...');
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .limit(1);

    if (addressError) {
      console.error('Error querying addresses:', addressError);
      return;
    }

    console.log('Address table columns:', addressData ? Object.keys(addressData[0] || {}) : 'No data');

    // Get table definition
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_definition', { table_name: 'addresses' });

    if (tableError) {
      console.log('Please run this SQL to check addresses table:');
      console.log(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_name = 'addresses'
        ORDER BY ordinal_position;
      `);
      return;
    }

    console.log('Table definition:', tableInfo);

  } catch (error) {
    console.error('Error checking address table:', error);
  }
}

// Run the check
checkAddressTable();
