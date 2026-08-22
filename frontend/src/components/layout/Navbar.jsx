import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { toggleSidebar } from '../../store/uiSlice';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-bg-inverse text-text-inverse flex items-center justify-between px-6 shadow-md z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <button onClick={() => dispatch(toggleSidebar())} className="text-light hover:text-accent-400 focus:outline-none">
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        )}
        <Link to="/" className="text-h4 font-bold tracking-tight">Academia-Industry Platform</Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-body-sm text-accent-200">Hello, {user?.email}</span>
            <Button variant="ghost" onClick={handleLogout} className="!text-light hover:!bg-primary-dark-600">Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-body text-light hover:text-accent-400">Login</Link>
            <Link to="/register">
              <Button variant="primary" className="!bg-light !text-primary-dark hover:!bg-accent-200">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
