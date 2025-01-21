import React, { useCallback, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

// Column definition
export interface TableColumn<T> {
  /** Unique identifier for the column */
  id: string;
  
  /** Column header text */
  header: string;
  
  /** Function to access the cell value */
  accessor: keyof T | ((row: T) => React.ReactNode);
  
  /** Whether the column is sortable */
  sortable?: boolean;
  
  /** Custom cell render function */
  cell?: (value: unknown, row: T) => React.ReactNode;
  
  /** Column width (px or %) */
  width?: string;
  
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Custom header render function */
  renderHeader?: (column: TableColumn<T>) => React.ReactNode;
}

// Sort configuration
export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

// Pagination configuration
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

// DataTable props
export interface DataTableProps<T extends Record<string, unknown>> {
  /** Data to display */
  data: T[];
  
  /** Column definitions */
  columns: TableColumn<T>[];
  
  /** Sort configuration */
  sorting?: SortConfig;
  
  /** Pagination configuration */
  pagination?: PaginationConfig;
  
  /** Row selection configuration */
  selection?: {
    selected: string[];
    onSelect: (ids: string[]) => void;
    getRowId: (row: T) => string;
  };
  
  /** Loading state */
  loading?: boolean;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Error message */
  error?: string;
  
  /** Additional class names */
  className?: string;
  
  /** Callback when sort changes */
  onSort?: (sort: SortConfig) => void;
  
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  
  /** Row click handler */
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  sorting,
  pagination,
  selection,
  loading = false,
  emptyMessage = 'No data available',
  error,
  className,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRowClick
}: DataTableProps<T>): React.ReactElement {
  // Local state for controlled sorting
  const [localSorting, setLocalSorting] = useState<SortConfig | undefined>(sorting);

  // Handle sort click
  const handleSort = useCallback((column: TableColumn<T>) => {
    if (!column.sortable) return;

    const newSort: SortConfig = {
      column: column.id,
      direction: !localSorting
        ? 'asc'
        : localSorting.column !== column.id
        ? 'asc'
        : localSorting.direction === 'asc'
        ? 'desc'
        : 'asc'
    };

    setLocalSorting(newSort);
    onSort?.(newSort);
  }, [localSorting, onSort]);

  // Handle row selection
  const handleRowSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    e.stopPropagation();
    if (!selection) return;

    const { selected, onSelect } = selection;
    const newSelected = e.target.checked
      ? [...selected, rowId]
      : selected.filter(id => id !== rowId);
    
    onSelect(newSelected);
  }, [selection]);

  // Handle select all
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selection) return;

    const { onSelect, getRowId } = selection;
    const newSelected = e.target.checked
      ? data.map(row => getRowId(row))
      : [];
    
    onSelect(newSelected);
  }, [selection, data]);

  // Calculate pagination values
  const {
    currentPage,
    totalPages,
    pageNumbers
  } = useMemo(() => {
    if (!pagination) return { currentPage: 1, totalPages: 1, pageNumbers: [1] };

    const { page, pageSize, total } = pagination;
    const totalPages = Math.ceil(total / pageSize);
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, i) => i + 1
    );

    return {
      currentPage: page,
      totalPages,
      pageNumbers
    };
  }, [pagination]);

  // Render sort indicator
  const renderSortIndicator = useCallback((column: TableColumn<T>) => {
    if (!column.sortable) return null;

    if (!localSorting || localSorting.column !== column.id) {
      return <ChevronsUpDown className="w-4 h-4 ml-1" />;
    }

    return localSorting.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  }, [localSorting]);

  // Render cell content
  const renderCell = useCallback((column: TableColumn<T>, row: T): React.ReactNode => {
    const rawValue = typeof column.accessor === 'function'
      ? column.accessor(row)
      : row[column.accessor];

    if (column.cell) {
      return column.cell(rawValue, row);
    }

    // Convert the raw value to a string if it's not already a ReactNode
    if (
      typeof rawValue === 'string' ||
      typeof rawValue === 'number' ||
      typeof rawValue === 'boolean' ||
      React.isValidElement(rawValue)
    ) {
      return rawValue;
    }

    // Handle null/undefined
    if (rawValue == null) {
      return '';
    }

    // Convert other types to string
    return String(rawValue);
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className || ''}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selection && (
              <th scope="col" className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selection.selected.length === data.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.id}
                scope="col"
                className={`
                  px-6 py-3 text-sm font-semibold text-gray-900
                  ${column.sortable ? 'cursor-pointer select-none' : ''}
                  ${column.align === 'center' ? 'text-center' : ''}
                  ${column.align === 'right' ? 'text-right' : ''}
                `}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.renderHeader?.(column) ?? column.header}
                  {renderSortIndicator(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={selection ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center"
              >
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
                  <span className="ml-2">Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={selection ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={selection?.getRowId(row) ?? rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  ${selection?.selected.includes(selection.getRowId(row)) ? 'bg-primary-50' : ''}
                `}
              >
                {selection && (
                  <td className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selection.selected.includes(selection.getRowId(row))}
                      onChange={e => handleRowSelect(e, selection.getRowId(row))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={column.id}
                    className={`
                      px-6 py-4 text-sm text-gray-900 whitespace-nowrap
                      ${column.align === 'center' ? 'text-center' : ''}
                      ${column.align === 'right' ? 'text-right' : ''}
                    `}
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {Math.min((currentPage - 1) * pagination.pageSize + 1, pagination.total)}
              </span>
              {' '}to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pagination.pageSize, pagination.total)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{pagination.total}</span>
              {' '}results
            </span>
            <select
              value={pagination.pageSize}
              onChange={e => onPageSizeChange?.(Number(e.target.value))}
              className="ml-4 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => onPageChange?.(number)}
                className={`
                  px-3 py-1 text-sm font-medium rounded-md
                  ${number === currentPage
                    ? 'bg-primary-50 text-primary-600 border border-primary-500'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}