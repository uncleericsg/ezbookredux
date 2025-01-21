import React, { useCallback, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Calendar, 
  CreditCard, 
  Wrench,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { 
  NotificationTemplate as NotificationTemplateType,
  NotificationType,
  NotificationPosition,
  BookingNotificationData,
  PaymentNotificationData,
  ServiceNotificationData,
  NotificationVariable
} from '@/types/notification';
import { interpolateTemplate } from '@/types/notification';
import { mergeClassNames } from '@/types/exactOptional';
import type { ExactOptionalPropertyTypes } from '@/types/exactOptional';

// Base notification props with optional callback
interface BaseNotificationProps<T extends Record<string, unknown>> {
  template: NotificationTemplateType<T>;
  data: T;
  onClose?: () => void;
}

// Type-safe notification props with exact optional properties
type NotificationTemplateProps<T extends Record<string, unknown>> = 
  ExactOptionalPropertyTypes<BaseNotificationProps<T>>;

const typeToIcon: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  booking: <Calendar className="h-5 w-5 text-purple-500" />,
  payment: <CreditCard className="h-5 w-5 text-indigo-500" />,
  service: <Wrench className="h-5 w-5 text-cyan-500" />
};

const typeToColor: Record<NotificationType, string> = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200',
  booking: 'bg-purple-50 border-purple-200',
  payment: 'bg-indigo-50 border-indigo-200',
  service: 'bg-cyan-50 border-cyan-200'
};

const positionToStyle: Record<NotificationPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
};

export function NotificationTemplate<T extends Record<string, unknown>>({
  template,
  data,
  onClose
}: NotificationTemplateProps<T>): React.ReactElement {
  const content = useMemo(() => 
    interpolateTemplate(template, data),
    [template, data]
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const positionClass = template.position ? 
    positionToStyle[template.position] : 
    positionToStyle['top-right'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={mergeClassNames(
          'fixed',
          positionClass,
          'max-w-sm w-full',
          'p-4 rounded-lg shadow-lg border',
          typeToColor[template.type]
        )}
        role="alert"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {typeToIcon[template.type]}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {template.title}
            </p>
            <div 
              className="mt-1 text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          {template.dismissible !== false && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className={mergeClassNames(
                  'inline-flex rounded-md',
                  'text-gray-400 hover:text-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'focus:ring-primary-500'
                )}
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Specialized notification components
export function BookingNotification({
  template,
  data,
  onClose
}: NotificationTemplateProps<BookingNotificationData>): React.ReactElement {
  return (
    <NotificationTemplate<BookingNotificationData>
      template={{
        ...template,
        type: 'booking'
      }}
      data={data}
      onClose={onClose}
    />
  );
}

export function PaymentNotification({
  template,
  data,
  onClose
}: NotificationTemplateProps<PaymentNotificationData>): React.ReactElement {
  return (
    <NotificationTemplate<PaymentNotificationData>
      template={{
        ...template,
        type: 'payment'
      }}
      data={data}
      onClose={onClose}
    />
  );
}

export function ServiceNotification({
  template,
  data,
  onClose
}: NotificationTemplateProps<ServiceNotificationData>): React.ReactElement {
  return (
    <NotificationTemplate<ServiceNotificationData>
      template={{
        ...template,
        type: 'service'
      }}
      data={data}
      onClose={onClose}
    />
  );
}