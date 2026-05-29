import React, { useState, useCallback } from 'react';

/**
 * Enhanced form validation hook with better error tracking
 */
export const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    const fieldValue = type === 'checkbox' ? checked : type === 'file' ? files?.[0] : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleSubmit = useCallback(async (e, customValidate) => {
    e?.preventDefault();
    
    const newErrors = customValidate ? customValidate(values) : {};

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitError('');
      try {
        await onSubmit(values);
      } catch (error) {
        setSubmitError(error.message || 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  }, [values, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError('');
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    setValues,
    errors,
    setFieldError,
    touched,
    isSubmitting,
    submitError,
    setSubmitError,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    bind: (name) => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
    }),
  };
};

/**
 * Field-level validation functions
 */
export const fieldValidators = {
  required: (message = 'This field is required') => (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return '';
  },

  email: (value) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email address';
  },

  minLength: (min, message) => (value) => {
    if (!value) return '';
    return value.length < min ? message || `Minimum ${min} characters required` : '';
  },

  maxLength: (max, message) => (value) => {
    if (!value) return '';
    return value.length > max ? message || `Maximum ${max} characters allowed` : '';
  },

  match: (compareValue, message = 'Fields do not match') => (value) => {
    return value === compareValue ? '' : message;
  },

  pattern: (pattern, message = 'Invalid format') => (value) => {
    if (!value) return '';
    return pattern.test(value) ? '' : message;
  },

  custom: (validatorFn) => validatorFn,
};
