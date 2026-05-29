// Form validation utilities
export const validators = {
  required: (value, fieldName) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Invalid email address';
  },

  minLength: (value, min, fieldName) => {
    if (!value) return null;
    return value.length < min ? `${fieldName} must be at least ${min} characters` : null;
  },

  maxLength: (value, max, fieldName) => {
    if (!value) return null;
    return value.length > max ? `${fieldName} must not exceed ${max} characters` : null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Invalid phone number';
  },

  cin: (value) => {
    if (!value) return null;
    return value.length >= 5 && value.length <= 20 ? null : 'Invalid CIN format';
  },

  dateOfBirth: (value) => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 16 ? null : 'You must be at least 16 years old';
  },

  gradeAverage: (value) => {
    if (!value) return null;
    const grade = parseFloat(value);
    if (isNaN(grade)) return 'Grade must be a number';
    return grade >= 0 && grade <= 20 ? null : 'Grade must be between 0 and 20';
  },

  passwordStrength: (value) => {
    if (!value) return null;
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain a number';
    return null;
  },

  match: (value, compareValue, fieldName) => {
    if (!value || !compareValue) return null;
    return value === compareValue ? null : `${fieldName} does not match`;
  },

  fileSize: (file, maxSizeMB) => {
    if (!file) return null;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes ? null : `File size must not exceed ${maxSizeMB}MB`;
  },

  fileType: (file, allowedTypes) => {
    if (!file) return null;
    return allowedTypes.includes(file.type) ? null : `File type must be one of: ${allowedTypes.join(', ')}`;
  },
};

// Form state hook
export const useFormValidation = (initialValues, onSubmit) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateField = React.useCallback((name, value, validationRules) => {
    if (!validationRules) return null;
    
    if (typeof validationRules === 'function') {
      return validationRules(value);
    }

    for (const rule of validationRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }, []);

  const handleChange = React.useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    const fieldValue = type === 'checkbox' ? checked : type === 'file' ? files?.[0] : value;
    
    setValues(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (touched[name]) {
      const error = validateField(name, fieldValue, validationRules[name]);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateField]);

  const handleBlur = React.useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, values[name], validationRules[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [values, validateField]);

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName], validationRules[fieldName]);
      if (error) newErrors[fieldName] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateField, onSubmit]);

  const setValidationRules = React.useRef({});

  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValidationRules: (rules) => {
      setValidationRules.current = rules;
    },
    validationRules: setValidationRules.current,
  };
};

import React from 'react';
