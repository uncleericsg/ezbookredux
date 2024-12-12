import axios from 'axios';
import { z } from 'zod';
import { toast } from 'sonner';
import type { ServiceVisit } from '../types';
import type { User } from '../types'; 
import { sendServiceNotification } from './notifications';
import type { ServiceVisit } from '../types';
import type { User } from '../types'; 

// Validation Schemas
const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  serviceReport: z.string().optional(),
  amcStatus: z.enum(['active', 'expired', 'pending', 'inactive'])
});

const serviceVisitSchema = z.object({
  id: z.string(),
  date: z.string(),
  label: z.string(),
  status: z.enum(['completed', 'scheduled', 'cancelled']),
  notes: z.string().optional(),
  technician: z.string().optional()
});

const configSchema = z.object({
  apiKey: z.string().min(1),
  tenantUrl: z.string().url()
});

interface ImportProgress {
  total: number;
  current: number;
  percentage: number;
}

interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  failedCount: number;
  errors: Array<{ id: string; error: string }>;
}

interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  failedCount: number;
  errors: Array<{ id: string; error: string }>;
}

const BATCH_SIZE = 50;
const IMPORT_DELAY = 1000; // 1 second delay between batches
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const bulkImportUsers = async (
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    message: '',
    importedCount: 0,
    failedCount: 0,
    errors: []
  };

  try {
    // Get total count first
    const { apiKey, tenantUrl } = validateRepairShoprConfig();
    const countResponse = await axios.get(`${tenantUrl}/api/v1/customers/count`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const total = countResponse.data.count;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        // Fetch batch of users
        const response = await axios.get(`${tenantUrl}/api/v1/customers`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          params: {
            page,
            per_page: BATCH_SIZE,
            include_tickets: true
          }
        });

        const users = response.data.customers;
        if (users.length === 0) {
          hasMore = false;
          continue;
        }

        // Process users in current batch
        for (const user of users) {
          try {
            // Extract latest service report from tickets
            const latestTicket = user.tickets?.[0];
            const serviceReport = latestTicket?.comments?.[0]?.body || '';

            // Determine AMC status from name
            const isAMC = user.lastName.toLowerCase().includes('amc');
            const amcStatus = isAMC ? 'active' : 'inactive';

            // Validate user data
            const validatedUser = userSchema.parse({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              address: user.address,
              serviceReport,
              amcStatus
            });

            // Import user
            await axios.post('/api/users/import', {
              source: 'repairshopr',
              userData: validatedUser
            });

            result.importedCount++;
          } catch (err) {
            result.failedCount++;
            result.errors.push({
              id: user.id,
              error: err instanceof Error ? err.message : 'Unknown error'
            });
          }
        }

        // Update progress
        const progress = Math.round((result.importedCount / total) * 100);
        onProgress?.({
          total,
          current: result.importedCount,
          percentage: progress
        });

        page++;
        await new Promise(resolve => setTimeout(resolve, IMPORT_DELAY));
      } catch (err) {
        console.error(`Failed to fetch page ${page}:`, err);
        result.failedCount += BATCH_SIZE;
      }
    }

    result.success = true;
    result.message = `Successfully imported ${result.importedCount} users` + 
      (result.failedCount > 0 ? `, ${result.failedCount} failed` : '');

  } catch (error) {
    console.error('Bulk import failed:', error);
    result.message = 'Import failed: ' + (error instanceof Error ? error.message : 'Unknown error');
  }

  return result;
};
const fetchServiceReports = async (userId: string): Promise<ServiceVisit[]> => {
  if (import.meta.env.DEV) {
    const mockVisits: ServiceVisit[] = [
      {
        id: '1',
        date: '2024-02-15',
        label: '#1ST VISIT',
        status: 'completed',
        notes: 'Regular maintenance completed',
        technician: 'John Doe'
      },
      {
        id: '2',
        date: '2024-05-15',
        label: '#2ND VISIT',
        status: 'scheduled',
        technician: 'Jane Smith'
      },
    ];
    return mockVisits;
  }

  try {
    const { apiKey, tenantUrl } = validateRepairShoprConfig();
    
    const response = await retryWithBackoff(() =>
      axios.get(`${tenantUrl}/api/v1/tickets`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          customer_id: userId,
          status: ['completed', 'scheduled', 'cancelled'].join(',')
        }
      })
    );

    const visits = response.data.tickets.map((ticket: any) => ({
      id: ticket.id,
      date: ticket.created_at,
      label: ticket.number,
      status: ticket.status.toLowerCase(),
      notes: ticket.problem,
      technician: ticket.tech
    }));

    return z.array(serviceVisitSchema).parse(visits);
  } catch (error) {
    console.error('Failed to fetch service reports:', error);
    toast.error('Failed to load service history');
    return [];
  }
};

const incrementVisitLabel = async (userId: string): Promise<void> => {
  try {
    const visits = await fetchServiceReports(userId);
    const completedVisits = visits.filter(v => v.status === 'completed');
    const nextVisitNumber = completedVisits.length + 1;

    if (nextVisitNumber > 4) {
      throw new Error('Maximum AMC visits reached for current period');
    }

    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    try {
      await axios.post(`/api/service-reports/${userId}/visits`, {
        visitNumber: nextVisitNumber,
        label: getVisitLabel(nextVisitNumber),
        status: 'scheduled',
        metadata: {
          visitSequence: nextVisitNumber,
          amcPeriod: getCurrentAMCPeriod(userId),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new Error('Visit label already exists');
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to increment visit label:', error);
    throw error;
  }
};

const updateServiceReport = async (
  reportId: string,
  status: ServiceVisit['status'],
  notes?: string
): Promise<void> => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  }

  try {
    await axios.put(`/api/service-reports/${reportId}`, {
      status,
      notes,
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    });
    
    // Send notification to next appointment if this one is completed
    if (status === 'completed') {
      try {
        const reports = await fetchServiceReports(userId);
        const nextAppointment = reports.find(r => r.status === 'scheduled');
        
        if (nextAppointment) {
          // Check if this is the third completed visit for AMC customers
          const completedVisits = reports.filter(r => r.status === 'completed').length;
          if (completedVisits === 3) {
            await sendServiceNotification(
              userId,
              'amcRenewalReminder',
              {
                first_name: user.firstName,
                visit_number: completedVisits + 1
              }
            );
          }

          await sendServiceNotification(
            userId,
            'serviceArrival',
            {
              first_name: user.firstName,
              appointment_time: nextAppointment.date,
              service_type: nextAppointment.label
            }
          );
        }
      } catch (error) {
        console.error('Failed to send next appointment notification:', error);
      }
    }
  } catch (error) {
    console.error('Failed to update service report:', error);
    throw error;
  }
};

const importUserTickets = async (userId: string): Promise<void> => {
  const response = await axios.get(`/api/repairshopr/customers/${userId}/tickets`);
  const tickets = response.data.tickets;

  for (const ticket of tickets) {
    await axios.post('/api/service-reports', {
      userId,
      date: ticket.created_at,
      status: ticket.status,
      notes: ticket.problem,
      technician: ticket.tech,
      ticketId: ticket.id
    });
  }
};

const importUserInvoices = async (userId: string): Promise<void> => {
  const response = await axios.get(`/api/repairshopr/customers/${userId}/invoices`);
  const invoices = response.data.invoices.filter(inv => inv.paid);

  for (const invoice of invoices) {
    await axios.post('/api/service-reports/invoices', {
      userId,
      date: invoice.created_at,
      amount: invoice.total,
      invoiceId: invoice.id,
      items: invoice.line_items
    });
  }
};

const resetVisitLabels = async (userId: string): Promise<void> => {
  try {
    // Archive old visits
    await axios.post(`/api/service-reports/${userId}/archive`);
    
    // Reset visit counter and create first visit label
    await axios.post(`/api/service-reports/${userId}/reset`, {
      amcPeriod: getCurrentAMCPeriod(userId),
    });
    
    // Create first visit label for new AMC period
    await incrementVisitLabel(userId);
  } catch (error) {
    console.error('Failed to reset visit labels:', error);
    throw error;
  }
};

const getVisitLabel = (visitNumber: number): string => {
  const suffixes = ['ST', 'ND', 'RD', 'TH'];
  const suffix = visitNumber <= 3 ? suffixes[visitNumber - 1] : suffixes[3];
  return `#${visitNumber}${suffix} VISIT`;
};

const getCurrentAMCPeriod = (userId: string): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${userId}`;
};

const authenticateUser = async (email: string, phone: string): Promise<User | null> => {
  if (import.meta.env.DEV) {
    // Test accounts for development
    if (email === 'iairconsg@gmail.com' && phone === '666iairconsg') {
      return {
        id: 'admin-1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'iairconsg@gmail.com',
        phone: '666iairconsg',
        role: 'admin',
        amcStatus: 'active',
        lastServiceDate: '2024-02-15',
        nextServiceDate: '2024-05-15',
      };
    }
    
    if (email === 'djxpire76@gmail.com' && phone === '666djxpire') {
      return {
        id: 'user-1',
        firstName: 'Test',
        lastName: 'User',
        email: 'djxpire76@gmail.com',
        phone: '666djxpire',
        role: 'user',
        amcStatus: 'active',
        lastServiceDate: '2024-02-15',
        nextServiceDate: '2024-05-15',
      };
    }

    return null;
  }

  try {
    const response = await axios.post('/api/auth/login', { email, phone });
    return response.data;
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
};

const validateRepairShoprConfig = (): { apiKey: string; tenantUrl: string } => {
  const apiKey = import.meta.env.VITE_REPAIRSHOPR_API_KEY;
  const tenantUrl = import.meta.env.VITE_REPAIRSHOPR_TENANT_URL;

  try {
    return configSchema.parse({ apiKey, tenantUrl });
  } catch (error) {
    throw new Error('Invalid RepairShopr configuration');
  }
};

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return retryWithBackoff(fn, retries - 1);
  }
};

const testConnection = async (): Promise<boolean> => {
  try {
    const { apiKey, tenantUrl } = validateRepairShoprConfig();
    
    const response = await retryWithBackoff(() =>
      axios.get(`${tenantUrl}/api/v1/status`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      })
    );

    return response.status === 200;
  } catch (error) {
    console.error('RepairShopr connection test failed:', error);
    toast.error('Failed to connect to RepairShopr');
    return false;
  }
};

const syncCustomerData = async (userId: string): Promise<boolean> => {
  try {
    const { apiKey, tenantUrl } = validateRepairShoprConfig();
    
    const response = await axios.get(`${tenantUrl}/api/v1/customers/${userId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.status === 200;
  } catch (error) {
    console.error('Failed to sync customer data:', error);
    return false;
  }
};

const syncInventoryData = async (): Promise<boolean> => {
  try {
    const { apiKey, tenantUrl } = validateRepairShoprConfig();
    
    const response = await axios.get(`${tenantUrl}/api/v1/products`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.status === 200;
  } catch (error) {
    console.error('Failed to sync inventory data:', error);
    return false;
  }
};

const processPayment = async (ticketId: string, amount: number): Promise<boolean> => {
  try {
    const { apiKey, tenantUrl } = validateRepairShoprConfig();
    
    const response = await axios.post(
      `${tenantUrl}/api/v1/invoices/${ticketId}/payments`,
      { amount },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Failed to process payment:', error);
    return false;
  }
};

// Export all functions in a single export statement
export {
  testConnection,
  syncCustomerData,
  syncInventoryData,
  processPayment,
  bulkImportUsers,
  fetchServiceReports,
  incrementVisitLabel,
  updateServiceReport,
  resetVisitLabels,
  authenticateUser
};