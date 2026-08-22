import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });
      if (response.success) {
        dispatch(setCredentials({ user: response.data.user, accessToken: response.data.tokens.accessToken }));
        
        // Route based on role
        if (response.data.user.role === 'student') navigate('/student/profile');
        else if (response.data.user.role === 'industry') navigate('/industry/profile');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-bg-page px-4">
      <Card animated className="w-full max-w-md">
        <h2 className="text-h2 font-bold mb-6 text-center text-primary-dark">Welcome Back</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-body-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-4" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-4 text-center text-body-sm text-text-muted">
          Don't have an account? <Link to="/register" className="text-primary-dark font-bold hover:underline">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
