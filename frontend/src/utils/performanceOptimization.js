import React, { Suspense, lazy } from 'react';
import { Spinner } from '../ui';

/**
 * Code splitting utilities for performance
 */

// Lazy load pages
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazyRegister = lazy(() => import('../pages/Register'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyApply = lazy(() => import('../pages/ApplyEnhanced'));
export const LazyAdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const LazyForgotPassword = lazy(() => import('../pages/ForgotPassword'));
export const LazyResetPassword = lazy(() => import('../pages/ResetPassword'));

// Lazy load components
export const LazyNotificationCenter = lazy(() => import('../components/EnhancedNotificationCenter'));
export const LazyChatWindow = lazy(() => import('../components/EnhancedChatWindow'));
export const LazyRoomManager = lazy(() => import('../components/RoomManager'));
export const LazyAdminAnalyticsDashboard = lazy(() => import('../components/AdminAnalyticsDashboard'));
export const LazyApplicationsList = lazy(() => import('../components/AdminApplicationsList'));

/**
 * Loading fallback component
 */
export const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner fullScreen message={message} />
  </div>
);

/**
 * Wrap components with suspense for better UX
 */
export const withSuspense = (Component, fallback = <LoadingFallback />) => {
  return (props) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * Image optimization utility
 */
export const OptimizedImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [imageRef, setImageRef] = React.useState();

  React.useEffect(() => {
    let observer;

    if (imageRef && imageSrc) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(imageRef);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [imageRef, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};

/**
 * Memoized component utility
 */
export const memoComponent = (Component, isEqual) => {
  return React.memo(Component, isEqual);
};

/**
 * Debounce hook for performance
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb) => setTimeout(cb, 1);
