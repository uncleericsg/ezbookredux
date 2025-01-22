import { supabaseClient } from '@/config/supabase/client';
import { initEnv } from '@/utils/env';

// Initialize environment variables
initEnv();

async function checkAddressTable() {
  try {
    // Get table structure
    console.log('Checking addresses table structure...');
    const { data: addressData, error: addressError } = await supabaseClient
      .from('addresses')
      .select('*')
      .limit(1);

    if (addressError) {
      console.error('Error querying addresses:', addressError);
      return;
    }

    console.log('Address table columns:', addressData ? Object.keys(addressData[0] || {}) : 'No data');

    // Get table definition
    const { data: tableInfo, error: tableError } = await supabaseClient
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
