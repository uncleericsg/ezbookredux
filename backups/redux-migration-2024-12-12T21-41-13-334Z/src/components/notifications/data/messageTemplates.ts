import { MessageTemplate } from '../types/messageTypes';

export const messageTemplates: MessageTemplate[] = [
  {
    id: 'service-reminder',
    name: 'Service Reminder',
    content: 'Hi {first_name}, this is a reminder that your next service is scheduled for {next_service_date} at {appointment_time}. Your technician {technician_name} will be visiting {customer_address}.',
    type: 'sms',
    characterLimit: 160
  },
  {
    id: 'follow-up',
    name: 'Service Follow-up',
    content: 'Hi {first_name}, thank you for choosing our service. How was your recent aircon service on {last_service_date}? We value your feedback!',
    type: 'whatsapp',
    characterLimit: 1000
  },
  {
    id: 'maintenance-email',
    name: 'Maintenance Report',
    content: 'Dear {first_name} {last_name},\n\nThis is a detailed report of your {service_type} conducted on {last_service_date}.\n\nYour next maintenance is scheduled for {next_service_date}.\n\nBest regards,\n{technician_name}',
    type: 'email',
    characterLimit: 5000
  }
];
