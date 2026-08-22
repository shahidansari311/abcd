import React from 'react';
import { motion } from 'framer-motion';
import { duration, ease } from '../../utils/motionTokens';

const Card = ({ children, className = '', animated = false, ...props }) => {
  const baseStyles = 'bg-bg-surface border border-border-default rounded shadow-sm p-6';
  
  if (animated) {
    return (
      <motion.div
        className={`${baseStyles} ${className}`}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: duration.slow, ease: ease.outSoft }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
