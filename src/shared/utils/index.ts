/**
 * Shared Utilities - Public API
 * Common utility functions used across features
 */

// String Utilities
export {
  capitalize,
  truncate,
  slugify,
  removeHtml,
  escapeHtml,
  generateId,
  formatBytes
} from './string';

// Date Utilities
export {
  formatDate,
  formatTime,
  formatDateTime,
  isDateValid,
  getRelativeTime,
  addDays,
  subtractDays,
  startOfDay,
  endOfDay
} from './date';

// Object Utilities
export {
  deepClone,
  deepMerge,
  omit,
  pick,
  isEmpty,
  isEqual,
  flattenObject,
  unflattenObject
} from './object';

// Array Utilities
export {
  unique,
  chunk,
  shuffle,
  sortBy,
  groupBy,
  partition,
  findDuplicates,
  intersection,
  difference
} from './array';

// Validation Utilities
export {
  isEmail,
  isUrl,
  isValidJson,
  isValidDate,
  isNumeric,
  isAlphanumeric,
  validatePassword,
  validatePhoneNumber
} from './validation';

// Performance Utilities
export {
  debounce,
  throttle,
  memoize,
  once,
  retry,
  timeout,
  measurePerformance
} from './performance';

// DOM Utilities
export {
  getElementPosition,
  scrollToElement,
  copyToClipboard,
  downloadFile,
  isElementVisible,
  getViewportSize
} from './dom';

// Format Utilities
export {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatFileSize,
  formatDuration
} from './format';

// Security Utilities
export {
  sanitizeInput,
  generateSecureId,
  hashString,
  encryptData,
  decryptData,
  validateCSRFToken
} from './security';

// Error Utilities
export {
  createError,
  isNetworkError,
  isAuthError,
  isValidationError,
  formatError,
  logError,
  reportError
} from './error';