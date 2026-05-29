/**
 * Accessibility utilities and ARIA helpers
 */

/**
 * Generate accessible form field with proper aria attributes
 */
export const getAccessibleFormProps = (fieldName, error, required = false) => {
  return {
    'aria-invalid': !!error,
    'aria-describedby': error ? `${fieldName}-error` : undefined,
    'aria-required': required,
  };
};

/**
 * Generate accessible error message props
 */
export const getAccessibleErrorProps = (fieldName) => {
  return {
    id: `${fieldName}-error`,
    role: 'alert',
  };
};

/**
 * Generate accessible button props for loading state
 */
export const getAccessibleLoadingProps = (isLoading, loadingText = 'Loading...') => {
  return {
    'aria-busy': isLoading,
    'aria-label': isLoading ? loadingText : undefined,
    disabled: isLoading,
  };
};

/**
 * Generate accessible modal props
 */
export const getAccessibleModalProps = (isOpen, title) => {
  return {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': isOpen ? 'modal-title' : undefined,
    'aria-hidden': !isOpen,
  };
};

/**
 * Generate accessible tab props
 */
export const getAccessibleTabProps = (isSelected, tabIndex) => {
  return {
    role: 'tab',
    'aria-selected': isSelected,
    'aria-controls': `tabpanel-${tabIndex}`,
    tabIndex: isSelected ? 0 : -1,
  };
};

/**
 * Generate accessible alert props
 */
export const getAccessibleAlertProps = (type = 'info') => {
  const roleMap = {
    error: 'alert',
    warning: 'alert',
    success: 'status',
    info: 'status',
  };

  return {
    role: roleMap[type] || 'status',
    'aria-live': type === 'error' || type === 'warning' ? 'assertive' : 'polite',
  };
};

/**
 * Generate accessible list props
 */
export const getAccessibleListProps = (isSorted = false) => {
  return {
    role: 'list',
    ...(isSorted && { 'aria-sort': 'ascending' }),
  };
};

/**
 * Generate accessible list item props
 */
export const getAccessibleListItemProps = () => {
  return {
    role: 'listitem',
  };
};

/**
 * Skip to main content link component
 */
export const SkipToMainContent = () => (
  <a
    href="#main-content"
    className="absolute top-0 left-0 px-4 py-2 -translate-y-12 bg-blue-600 text-white rounded focus:translate-y-0 focus:outline-none z-50 transition-transform"
  >
    Skip to main content
  </a>
);

/**
 * Accessible label component
 */
export const AccessibleLabel = ({ htmlFor, required = false, children, ...props }) => (
  <label htmlFor={htmlFor} {...props}>
    {children}
    {required && (
      <span className="text-red-500 ml-1" aria-label="required">
        *
      </span>
    )}
  </label>
);

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Use reduced motion in animations
 */
export const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e) => setPrefersReduced(e.matches);
    mediaQuery.addListener(handler);

    return () => mediaQuery.removeListener(handler);
  }, []);

  return prefersReduced;
};

/**
 * Announcement utility for screen readers
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // visually hidden but accessible to screen readers
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

import React from 'react';
