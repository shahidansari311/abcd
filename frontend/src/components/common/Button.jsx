import React from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '../../utils/motionTokens';

const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '', ...props }) => {
  const baseStyles = 'px-6 py-2 rounded font-base text-body focus:outline-none transition-colors';
  const variants = {
    primary: 'bg-primary-dark text-light hover:bg-primary-dark-600',
    secondary: 'bg-light text-primary-dark border border-border-default hover:bg-accent-200',
    ghost: 'bg-transparent text-primary-dark hover:bg-accent-200',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: duration.fast, ease: ease.standard }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
