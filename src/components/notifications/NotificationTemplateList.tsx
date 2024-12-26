import React, { useState, useMemo, useCallback } from 'react';
import { Search, Trash2 } from 'lucide-react';
import TemplateItem from '~/components/notifications/TemplateItem';
import { ITEMS_PER_PAGE, SORT_OPTIONS, TEST_IDS } from '~/components/notifications/constants/templateConstants';
import type { TemplateListProps, NotificationTemplate } from '~/types/notifications';
import { Button } from '~/components/atoms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/molecules/Select';
import { Input } from '~/components/atoms/Input';
import { ScrollArea } from '~/components/molecules/ScrollArea';
import { Skeleton } from '~/components/atoms/Skeleton';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/components/atoms/Alert';
import { useRetry } from '~/hooks/useRetry';
import { cn } from '@utils/cn';

/**
 * NotificationTemplateList Component
 * 
 * Displays a list of notification templates with search, sort, and pagination capabilities.
 * Supports bulk actions and provides accessibility features.
 * 
 * @param {TemplateListProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const NotificationTemplateList: React.FC<TemplateListProps> = ({
  templates,
  onEdit,
  onDelete,
  loading,
  error,
  onRetry,
  className
}) => {
  // State management
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Error retry handling
  const { isRetrying, handleRetry } = useRetry(onRetry);

  // Memoized filtered and sorted templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter(template => 
        template.title.toLowerCase().includes(search.toLowerCase()) ||
        template.message.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case SORT_OPTIONS.TITLE:
            return a.title.localeCompare(b.title);
          case SORT_OPTIONS.TYPE:
            return a.type.localeCompare(b.type);
          case SORT_OPTIONS.STATUS:
            return a.status.localeCompare(b.status);
          case SORT_OPTIONS.DATE:
          default:
            return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        }
      });
  }, [templates, search, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((value: string) => {
    setSortBy(value as keyof typeof SORT_OPTIONS);
    setCurrentPage(1);
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === paginatedTemplates.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedTemplates.map(t => t.id));
    }
  }, [paginatedTemplates, selectedItems]);

  const handleBulkDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} templates?`)) {
      selectedItems.forEach(onDelete);
      setSelectedItems([]);
    }
  }, [selectedItems, onDelete]);

  if (loading) {
    return (
      <div 
        className="space-y-4"
        data-testid={TEST_IDS.TEMPLATE_LIST}
        aria-busy="true"
        aria-label="Loading templates"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={cn("space-y-4", className)}
      data-testid={TEST_IDS.TEMPLATE_LIST}
      role="region"
      aria-label="Notification Templates"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={handleSearch}
            className="pl-9"
            data-testid={TEST_IDS.SEARCH_INPUT}
            aria-label="Search templates"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={handleSort}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_OPTIONS).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                Sort by {key.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between rounded-md border p-2">
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} templates selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete selected
          </Button>
        </div>
      )}

      <ScrollArea className="h-[600px] rounded-md border">
        {!filteredTemplates.length ? (
          <div 
            className="flex h-full items-center justify-center p-8 text-center text-muted-foreground"
            role="status"
          >
            No templates found
          </div>
        ) : (
          <div role="list" className="space-y-2 p-4">
            {paginatedTemplates.map((template) => (
              <TemplateItem
                key={template.id}
                template={template}
                onEdit={onEdit}
                onDelete={onDelete}
                onSelect={(id) => {
                  setSelectedItems(prev =>
                    prev.includes(id)
                      ? prev.filter(i => i !== id)
                      : [...prev, id]
                  );
                }}
                isSelected={selectedItems.includes(template.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {filteredTemplates.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationTemplateList;