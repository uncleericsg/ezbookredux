import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@components/atoms/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/molecules/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/atoms/tooltip';
import { Badge } from '@components/atoms/badge';
import { HolidayItemProps } from './types';
import { motion } from 'framer-motion';

const HolidayItem: React.FC<HolidayItemProps> = React.memo(({ holiday, onSchedule, style }) => {
  const formattedDate = format(parseISO(holiday.date), 'MMMM do, yyyy');

  return (
    <Card 
      className={cn(
        "w-full transition-all hover:shadow-md",
        "border border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
      style={style}
      role="listitem"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{holiday.name}</CardTitle>
          <Badge variant="outline" className="ml-2">
            <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
            {formattedDate}
          </Badge>
        </div>
        {holiday.description && (
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            {holiday.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex justify-end pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onSchedule(holiday)}
                size="sm"
                className="gap-2"
                aria-label={`Schedule greeting for ${holiday.name}`}
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                Schedule
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Schedule greeting</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
});

HolidayItem.displayName = 'HolidayItem';

export default HolidayItem;
