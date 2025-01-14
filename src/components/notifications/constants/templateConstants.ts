export const ITEMS_PER_PAGE = 10;

export const TEMPLATE_TYPES = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
} as const;

export const SORT_OPTIONS = {
  TITLE: 'title',
  DATE: 'date',
  TYPE: 'type',
  STATUS: 'status',
} as const;

export const MESSAGE_LIMITS = {
  [TEMPLATE_TYPES.EMAIL]: 10000,
  [TEMPLATE_TYPES.PUSH]: 500,
  [TEMPLATE_TYPES.SMS]: 160,
} as const;

export const TEST_IDS = {
  TEMPLATE_LIST: 'template-list',
  TEMPLATE_ITEM: 'template-item',
  TEMPLATE_ACTIONS: 'template-actions',
  SEARCH_INPUT: 'search-input',
  SORT_SELECT: 'sort-select',
  PAGINATION: 'pagination',
} as const;
