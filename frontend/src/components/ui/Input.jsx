import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  icon: Icon,
  success = false,
  className = '',
  showPasswordToggle = false,
  inputClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`relative ${className}`}>
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} rounded-lg border-2 transition-all duration-200
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30' 
              : success
              ? 'border-green-500 focus:border-green-500 focus:ring-green-100 dark:focus:ring-green-900/30'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
            }
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${inputClassName}`}
          {...props}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {success && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircle size={18} />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{hint}</p>
      )}
    </div>
  );
};

export default Input;
