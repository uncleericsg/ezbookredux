import { useState, useCallback, useEffect } from 'react';
import { Template } from '../utils/templateUtils';
import { ITEMS_PER_PAGE } from '../constants/templateConstants';

interface UseTemplateOperationsProps {
  templates: Template[];
  onDelete: (id: string) => void;
}

interface UseTemplateOperationsReturn {
  filteredTemplates: Template[];
  paginatedTemplates: Template[];
  selectedItems: string[];
  currentPage: number;
  totalPages: number;
  search: string;
  sortBy: string;
  handleSearch: (term: string) => void;
  handleSort: (criteria: string) => void;
  handlePageChange: (page: number) => void;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  handleBulkDelete: () => void;
  clearSelection: () => void;
}

export const useTemplateOperations = ({
  templates,
  onDelete,
}: UseTemplateOperationsProps): UseTemplateOperationsReturn => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template =>
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'date':
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearch(term);
  }, []);

  const handleSort = useCallback((criteria: string) => {
    setSortBy(criteria);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedItems(prev =>
      prev.length === paginatedTemplates.length
        ? []
        : paginatedTemplates.map(t => t.id)
    );
  }, [paginatedTemplates]);

  const handleBulkDelete = useCallback(() => {
    if (window.confirm(\`Are you sure you want to delete \${selectedItems.length} templates?\`)) {
      selectedItems.forEach(onDelete);
      setSelectedItems([]);
    }
  }, [selectedItems, onDelete]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return {
    filteredTemplates,
    paginatedTemplates,
    selectedItems,
    currentPage,
    totalPages,
    search,
    sortBy,
    handleSearch,
    handleSort,
    handlePageChange,
    toggleSelection,
    toggleSelectAll,
    handleBulkDelete,
    clearSelection,
  };
};
