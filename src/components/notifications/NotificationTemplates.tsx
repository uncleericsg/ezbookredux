import React from 'react';
import CustomMessageScheduler from './CustomMessageScheduler';
import { Card, CardContent, CardHeader, CardTitle } from '@components/molecules/card';
import { cn } from '@/lib/utils';

interface NotificationTemplatesProps {
  className?: string;
}

const NotificationTemplates: React.FC<NotificationTemplatesProps> = ({
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Custom Message Scheduler</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomMessageScheduler />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTemplates;