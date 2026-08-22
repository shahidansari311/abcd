import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../../api/authApi';
import { setCredentials } from '../../store/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    firstName: '',
    lastName: '',
    companyName: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Clean up unneeded fields based on role
    const payload = { ...formData };
    if (payload.role === 'student') {
      delete payload.companyName;
    } else if (payload.role === 'industry') {
      delete payload.firstName;
      delete payload.lastName;
    }

    try {
      const response = await registerApi(payload);
      if (response.success) {
        dispatch(setCredentials({ user: response.data.user, accessToken: response.data.tokens.accessToken }));
        
        if (response.data.user.role === 'student') navigate('/student/profile');
        else if (response.data.user.role === 'industry') navigate('/industry/profile');
        else navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-bg-page px-4 py-8">
      <Card animated className="w-full max-w-md">
        <h2 className="text-h2 font-bold mb-6 text-center text-primary-dark">Create an Account</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-body-sm">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-body-sm font-base text-text-muted mb-1 block">I am a...</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-default rounded font-base text-body bg-bg-surface focus:outline-none focus:border-accent-600"
            >
              <option value="student">Student</option>
              <option value="industry">Industry Professional / Recruiter</option>
            </select>
          </div>

          <Input 
            label="Email Address" 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            required 
          />

          {formData.role === 'student' && (
            <div className="flex gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          )}

          {formData.role === 'industry' && (
             <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
          )}

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-4" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-center text-body-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-primary-dark font-bold hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
