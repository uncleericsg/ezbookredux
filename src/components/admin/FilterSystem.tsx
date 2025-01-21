import React, { useCallback } from 'react';
import { X, Plus, Filter } from 'lucide-react';
import { TextField } from '../../components/form/TextField';
import { SelectField } from '../../components/form/SelectField';
import { DateField } from '../../components/form/DateField';
import { Form } from '../../components/form/Form';
import type { ValidationRule } from '../../components/form/context';

// Filter types and operators
export type FilterType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isNull'
  | 'isNotNull';

// Filter configuration
export interface FilterConfig<T> {
  field: keyof T;
  type: FilterType;
  label: string;
  operators?: FilterOperator[];
  options?: Array<{
    label: string;
    value: unknown;
  }>;
  validation?: ValidationRule[];
}

// Filter value
export interface FilterValue {
  field: string;
  operator: FilterOperator;
  value: unknown;
  valueTo?: unknown;
}

// Form values type
interface FilterFormValues {
  field: string;
  operator: FilterOperator;
  value: unknown;
  valueTo?: unknown;
}

// FilterSystem props
export interface FilterSystemProps<T> {
  filters: FilterConfig<T>[];
  value: FilterValue[];
  onChange: (filters: FilterValue[]) => void;
  className?: string;
}

export function FilterSystem<T>({
  filters,
  value,
  onChange,
  className
}: FilterSystemProps<T>): React.ReactElement {
  // Get available operators for a filter type
  const getOperators = useCallback((type: FilterType): FilterOperator[] => {
    const baseOperators: FilterOperator[] = ['equals', 'notEquals', 'isNull', 'isNotNull'];
    
    switch (type) {
      case 'text':
        return [...baseOperators, 'contains', 'notContains', 'startsWith', 'endsWith'];
      case 'number':
      case 'date':
        return [...baseOperators, 'greaterThan', 'lessThan', 'between'];
      case 'select':
        return [...baseOperators, 'in', 'notIn'];
      case 'boolean':
        return ['equals'];
      default:
        return baseOperators;
    }
  }, []);

  // Add new filter
  const handleAddFilter = useCallback(() => {
    const firstFilter = filters[0];
    const newFilter: FilterValue = {
      field: String(firstFilter.field),
      operator: getOperators(firstFilter.type)[0],
      value: null
    };
    onChange([...value, newFilter]);
  }, [filters, value, onChange, getOperators]);

  // Remove filter
  const handleRemoveFilter = useCallback((index: number) => {
    const newFilters = [...value];
    newFilters.splice(index, 1);
    onChange(newFilters);
  }, [value, onChange]);

  // Update filter
  const handleFilterChange = useCallback((
    index: number,
    updates: Partial<FilterFormValues>
  ) => {
    const newFilters = [...value];
    newFilters[index] = {
      ...newFilters[index],
      ...updates
    };

    // Reset value when field or operator changes
    if (updates.field || updates.operator) {
      newFilters[index].value = null;
      newFilters[index].valueTo = undefined;
    }

    onChange(newFilters);
  }, [value, onChange]);

  // Render filter input based on type
  const renderFilterInput = useCallback((
    filter: FilterConfig<T>,
    filterValue: FilterValue,
    index: number
  ) => {
    const commonProps = {
      required: true,
      className: 'w-full'
    };

    switch (filter.type) {
      case 'select':
        return (
          <Form<{ value: unknown }>
            initialValues={{ value: filterValue.value }}
            onSubmit={async (values) => {
              handleFilterChange(index, { value: values.value });
            }}
          >
            {() => (
              <SelectField
                {...commonProps}
                name="value"
                label="Value"
                options={filter.options || []}
                multiple={['in', 'notIn'].includes(filterValue.operator)}
              />
            )}
          </Form>
        );
      case 'date':
        return (
          <Form<{ value: string; valueTo?: string }>
            initialValues={{
              value: filterValue.value as string,
              valueTo: filterValue.valueTo as string
            }}
            onSubmit={async (values) => {
              handleFilterChange(index, {
                value: values.value,
                valueTo: values.valueTo
              });
            }}
          >
            {() => (
              <>
                <DateField
                  {...commonProps}
                  name="value"
                  label="Value"
                />
                {filterValue.operator === 'between' && (
                  <DateField
                    {...commonProps}
                    name="valueTo"
                    label="To"
                  />
                )}
              </>
            )}
          </Form>
        );
      case 'number':
        return (
          <Form<{ value: number; valueTo?: number }>
            initialValues={{
              value: filterValue.value as number,
              valueTo: filterValue.valueTo as number
            }}
            onSubmit={async (values) => {
              handleFilterChange(index, {
                value: values.value,
                valueTo: values.valueTo
              });
            }}
          >
            {() => (
              <>
                <TextField
                  {...commonProps}
                  type="number"
                  name="value"
                  label="Value"
                />
                {filterValue.operator === 'between' && (
                  <TextField
                    {...commonProps}
                    type="number"
                    name="valueTo"
                    label="To"
                  />
                )}
              </>
            )}
          </Form>
        );
      default:
        return (
          <Form<{ value: string }>
            initialValues={{ value: filterValue.value as string }}
            onSubmit={async (values) => {
              handleFilterChange(index, { value: values.value });
            }}
          >
            {() => (
              <TextField
                {...commonProps}
                type="text"
                name="value"
                label="Value"
              />
            )}
          </Form>
        );
    }
  }, [handleFilterChange]);

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          type="button"
          onClick={handleAddFilter}
          className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Filter
        </button>
      </div>

      {value.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 border-2 border-dashed rounded-lg">
          <Filter className="w-8 h-8 mb-2" />
          <p>No filters applied</p>
          <button
            type="button"
            onClick={handleAddFilter}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            Add your first filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {value.map((filterValue, index) => {
            const filterConfig = filters.find(f => String(f.field) === filterValue.field);
            if (!filterConfig) return null;

            const operators = getOperators(filterConfig.type);

            return (
              <div
                key={index}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form<{ field: string }>
                      initialValues={{ field: filterValue.field }}
                      onSubmit={async (values) => {
                        handleFilterChange(index, { field: values.field });
                      }}
                    >
                      {() => (
                        <SelectField
                          name="field"
                          label="Field"
                          options={filters.map(f => ({
                            label: f.label,
                            value: String(f.field)
                          }))}
                        />
                      )}
                    </Form>

                    <Form<{ operator: FilterOperator }>
                      initialValues={{ operator: filterValue.operator }}
                      onSubmit={async (values) => {
                        handleFilterChange(index, { operator: values.operator });
                      }}
                    >
                      {() => (
                        <SelectField
                          name="operator"
                          label="Operator"
                          options={operators.map(op => ({
                            label: op.replace(/([A-Z])/g, ' $1').toLowerCase(),
                            value: op
                          }))}
                        />
                      )}
                    </Form>

                    {!['isNull', 'isNotNull'].includes(filterValue.operator) && (
                      <div className="flex-1">
                        {renderFilterInput(filterConfig, filterValue, index)}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFilter(index)}
                    className="ml-4 p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}