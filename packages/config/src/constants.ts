/** Business constants shared across apps */
export const CONSTANTS = {
  /** Stock reservation timeout in minutes */
  STOCK_RESERVATION_TIMEOUT_MINUTES: 15,

  /** Maximum retry attempts for integration events */
  MAX_EVENT_RETRIES: 5,

  /** Default currency */
  DEFAULT_CURRENCY: 'CLP',

  /** Decimal precision for monetary values */
  MONETARY_PRECISION: 2,
  MONETARY_SCALE: 10,

  /** Pagination defaults */
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  /** ISR revalidation in seconds */
  ISR_REVALIDATE_PRODUCT: 60,
  ISR_REVALIDATE_CATEGORY: 300,
} as const;
