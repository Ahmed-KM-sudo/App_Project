import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverable = false,
  clickable = false,
  onClick,
  gradient = false,
  ...props
}) => {
  const baseStyles = 'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden';
  
  const styles = `${baseStyles} ${
    hoverable ? 'hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer' : 'shadow-md'
  } ${clickable ? 'cursor-pointer' : ''} ${gradient ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : ''} ${className}`;

  const content = (
    <div className={styles} {...props}>
      {children}
    </div>
  );

  if (clickable || hoverable) {
    return (
      <motion.div
        whileHover={hoverable ? { y: -4 } : {}}
        onClick={onClick}
        className="cursor-pointer"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default Card;
