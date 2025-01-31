import React, { useCallback, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { TimeSlot } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualizedTimeSlotsProps {
  slots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onSlotSelect: (slot: TimeSlot) => void;
  isLoading?: boolean;
  loadMore?: () => void;
}

export const VirtualizedTimeSlots: React.FC<VirtualizedTimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading,
  loadMore
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: slots.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimated height of each row
    overscan: 5 // Number of items to render outside of the visible window
  });

  // Intersection observer for infinite loading
  useEffect(() => {
    if (!loadMore || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore, isLoading]);

  const renderTimeSlot = useCallback((slot: TimeSlot, index: number) => {
    const isSelected = selectedSlot?.id === slot.id;
    const isOptimized = slot.optimized;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className={`
          p-4 rounded-lg border-2 transition-all cursor-pointer
          ${isSelected 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-700 hover:border-blue-500/50'}
          ${isOptimized ? 'border-green-500/30' : ''}
        `}
        onClick={() => onSlotSelect(slot)}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">
              {new Date(slot.datetime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            {slot.optimized && (
              <p className="text-sm text-green-400">Optimized</p>
            )}
          </div>
          {slot.loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          )}
        </div>
      </motion.div>
    );
  }, [selectedSlot, onSlotSelect]);

  return (
    <div
      ref={parentRef}
      className="h-[400px] overflow-auto"
      style={{
        contain: 'strict'
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        <AnimatePresence>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              {renderTimeSlot(slots[virtualItem.index], virtualItem.index)}
            </div>
          ))}
        </AnimatePresence>
        
        {loadMore && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
            ) : (
              <p className="text-gray-400">Scroll for more time slots</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
