import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-bg-page z-50' 
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <motion.div
        className="w-10 h-10 border-4 border-accent-200 border-t-primary-dark rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default Loader;
