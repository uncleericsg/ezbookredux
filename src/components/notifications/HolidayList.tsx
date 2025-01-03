import { useCallback, useState, useMemo } from 'react';
import { RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHolidayNotifications } from '@hooks/useHolidayNotifications';
import HolidayGreetingModal from './HolidayGreetingModal';
import { useHolidayGreetings } from '@hooks/useHolidayGreetings';
import { useAcuitySettings } from '@hooks/useAcuitySettings';
import { toast } from 'sonner';
import ErrorBoundary from './ErrorBoundary';
import { Button } from '@components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@components/organisms/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@components/atoms/tooltip';
import { Skeleton } from '@components/atoms/skeleton';
import { ScrollArea } from '@components/molecules/scroll-area';
import { AutoSizer, List } from 'react-virtualized';
import HolidayItem from './HolidayItem';
import { cn } from '../../lib/utils';
import type { Holiday, HolidayListProps } from './types';

const ITEMS_PER_PAGE = 10;
const ITEM_HEIGHT = 120;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

/**
 * HolidayListContent component displays a list of upcoming holidays with scheduling capabilities
 * Implements virtualization for performance and includes error handling and retry logic
 */
const HolidayListContent: React.FC<HolidayListProps> = ({ className }) => {
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewMessage, setPreviewMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { upcomingHolidays, loading, error, refetch } = useHolidayNotifications();
  const { settings } = useAcuitySettings();
  const { generateGreeting, updateGreeting } = useHolidayGreetings({
    chatGPTSettings: settings?.chatGPTSettings
  });

  const totalPages = Math.ceil(upcomingHolidays.length / ITEMS_PER_PAGE);
  
  const paginatedHolidays = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return upcomingHolidays.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [upcomingHolidays, currentPage]);

  const handleSchedule = useCallback(async (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    
    try {
      const message = await generateGreeting(holiday);
      setPreviewMessage(message);
      setShowConfirmation(true);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while preparing the greeting';
      toast.error(errorMessage);
    }
  }, [generateGreeting]);

  const confirmSchedule = useCallback(async () => {
    if (!selectedHoliday) return;

    let attempts = 0;
    while (attempts < RETRY_ATTEMPTS) {
      try {
        await updateGreeting({
          holidayId: selectedHoliday.id,
          message: previewMessage
        });
        
        toast.success('Holiday greeting scheduled successfully!');
        setShowConfirmation(false);
        setSelectedHoliday(null);
        setPreviewMessage('');
        return;
      } catch (error) {
        attempts++;
        if (attempts === RETRY_ATTEMPTS) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to schedule greeting';
          toast.error(errorMessage);
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }, [selectedHoliday, previewMessage, updateGreeting]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  const rowRenderer = useCallback(({ index, style }) => {
    const holiday = paginatedHolidays[index];
    return (
      <div className="p-2" style={style}>
        <HolidayItem
          key={holiday.id}
          holiday={holiday}
          onSchedule={handleSchedule}
        />
      </div>
    );
  }, [paginatedHolidays, handleSchedule]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center" role="alert">
        <p className="text-destructive mb-4">{error.message}</p>
        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Retry loading holidays"
        >
          <RefreshCcw className="w-4 h-4" aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <ScrollArea className="h-[600px] w-full rounded-md border">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[100px] w-full" />
            ))}
          </div>
        ) : (
          <div style={{ height: ITEM_HEIGHT * Math.min(paginatedHolidays.length, 5) }}>
            <AutoSizer>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={paginatedHolidays.length}
                  rowHeight={ITEM_HEIGHT}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center justify-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Greeting</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {previewMessage}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmation(false);
                setPreviewMessage('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmSchedule}>
              Confirm & Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const HolidayList: React.FC<HolidayListProps> = (props) => (
  <ErrorBoundary>
    <HolidayListContent {...props} />
  </ErrorBoundary>
);

export default HolidayList;