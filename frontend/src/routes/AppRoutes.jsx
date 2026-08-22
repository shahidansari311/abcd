import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import Loader from '../components/common/Loader';
import Navbar from '../components/layout/Navbar';

// Lazy loading pages
const HomePage = React.lazy(() => import('../pages/landing/HomePage'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage'));
const StudentProfilePage = React.lazy(() => import('../pages/student/ProfilePage'));
const IndustryProfilePage = React.lazy(() => import('../pages/industry/OrganizationProfilePage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><HomePage /></>} />
        <Route path="/login" element={<><Navbar /><LoginPage /></>} />
        <Route path="/register" element={<><Navbar /><RegisterPage /></>} />
        <Route path="/unauthorized" element={<div className="p-10 text-center">Unauthorized Access</div>} />
        <Route path="*" element={<div className="p-10 text-center">404 Not Found</div>} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          
          {/* Student Routes */}
          <Route element={<RoleBasedRoute allowedRoles={['student']} />}>
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>

          {/* Industry Routes */}
          <Route element={<RoleBasedRoute allowedRoles={['industry']} />}>
            <Route path="/industry/profile" element={<IndustryProfilePage />} />
          </Route>

        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
