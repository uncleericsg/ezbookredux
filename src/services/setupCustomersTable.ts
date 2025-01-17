import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/lib/logger';
import { handleConfigurationError } from '@/utils/apiErrors';

export async function setupCustomersTable(): Promise<void> {
  logger.info('Setting up customers table');

  try {
    // Check if table exists
    const { error: checkError } = await supabaseClient
      .from('customers')
      .select('id')
      .limit(1);

    if (checkError?.code === '42P01') { // Table does not exist
      logger.info('Creating customers table');
      
      const { error: createError } = await supabaseClient.rpc('create_customers_table');
      
      if (createError) {
        logger.error('Failed to create customers table', {
          message: createError.message
        });
        throw handleConfigurationError('Failed to create customers table');
      }

      logger.info('Successfully created customers table');
    }

    await addCustomerColumns();
    await migrateCustomerData();
    await validateCustomerSchema();

  } catch (error) {
    logger.error('Failed to setup customers table', {
      message: error instanceof Error ? error.message : String(error)
    });
    throw handleConfigurationError('Failed to setup customers table');
  }
}

async function addCustomerColumns(): Promise<void> {
  logger.info('Adding customer columns');

  try {
    const { error } = await supabaseClient.rpc('add_customer_columns');
    
    if (error) {
      logger.error('Failed to add customer columns', {
        message: error.message
      });
      throw handleConfigurationError('Failed to add customer columns');
    }

    logger.info('Successfully added customer columns');
  } catch (error) {
    logger.error('Failed to add customer columns', {
      message: error instanceof Error ? error.message : String(error)
    });
    throw handleConfigurationError('Failed to add customer columns');
  }
}

async function migrateCustomerData(): Promise<void> {
  logger.info('Migrating customer data');

  try {
    const { error } = await supabaseClient.rpc('migrate_customer_data');
    
    if (error) {
      logger.error('Failed to migrate customer data', {
        message: error.message
      });
      throw handleConfigurationError('Failed to migrate customer data');
    }

    logger.info('Successfully migrated customer data');
  } catch (error) {
    logger.error('Failed to migrate customer data', {
      message: error instanceof Error ? error.message : String(error)
    });
    throw handleConfigurationError('Failed to migrate customer data');
  }
}

async function validateCustomerSchema(): Promise<void> {
  logger.info('Validating customer schema');

  try {
    const { error } = await supabaseClient.rpc('validate_customer_schema');
    
    if (error) {
      logger.error('Failed to validate customer schema', {
        message: error.message
      });
      throw handleConfigurationError('Failed to validate customer schema');
    }

    logger.info('Successfully validated customer schema');
  } catch (error) {
    logger.error('Failed to validate customer schema', {
      message: error instanceof Error ? error.message : String(error)
    });
    throw handleConfigurationError('Failed to validate customer schema');
  }
}
