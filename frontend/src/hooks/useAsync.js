import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Hook for handling async operations with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error.message || 'An error occurred');
      setStatus('error');
      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { execute, status, data, error, isLoading: status === 'pending' };
};

/**
 * Hook for managing API calls with error handling
 */
export const useApi = (apiCall, showToast = true) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall(...args);
      setData(response);
      
      if (showToast && response?.message) {
        toast.success(response.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showToast) {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
};

/**
 * Hook for debounced values
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for handling file uploads
 */
export const useFileUpload = (onUpload, maxSize = 5) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must not exceed ${maxSize}MB`);
      return;
    }

    setFile(selectedFile);
    setError('');

    // Generate preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const upload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      setPreview('');
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    preview,
    error,
    isUploading,
    handleFileChange,
    upload,
    reset: () => {
      setFile(null);
      setPreview('');
      setError('');
    },
  };
};
