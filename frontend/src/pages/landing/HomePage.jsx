import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-bg-page text-center px-4">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-h1 font-bold text-primary-dark mb-4"
      >
        Bridging the Gap Between Academia and Industry
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        className="text-body-lg text-text-muted mb-8 max-w-2xl"
      >
        Assess your skills, discover tailored career roadmaps, and connect with top industry opportunities based on verifiable credentials.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      >
        <Link to="/register">
          <Button variant="primary" className="mr-4 !px-8 !py-3 text-h4">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="!px-8 !py-3 text-h4">Login</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;
