import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const getLinksForRole = (role) => {
    switch (role) {
      case 'student':
        return [
          { label: 'Profile', path: '/student/profile' },
          { label: 'Opportunities', path: '/student/opportunities' },
        ];
      case 'industry':
        return [
          { label: 'Organization Profile', path: '/industry/profile' },
        ];
      default:
        return [];
    }
  };

  const links = getLinksForRole(user?.role);

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -250, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -250, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="w-64 bg-bg-surface border-r border-border-default h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0"
        >
          <div className="p-4">
            <h2 className="text-caption uppercase text-text-muted font-bold mb-4">Menu</h2>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-2 rounded text-body ${
                      location.pathname.startsWith(link.path)
                        ? 'bg-primary-dark-100 text-primary-dark font-bold'
                        : 'text-text-muted hover:bg-light hover:text-primary-dark'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
