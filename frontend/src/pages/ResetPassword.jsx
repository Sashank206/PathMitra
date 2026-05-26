import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import api from '../utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get token and email from URL parameters
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (token && email) {
      setFormData(prev => ({ ...prev, token, email }));
    } else {
      setStatus('error');
      setMessage('Invalid password reset link.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }
    
    setStatus('loading');
    setMessage('');
    
    try {
      const response = await api.post('/reset-password', formData);
      setStatus('success');
      setMessage(response.data.message || 'Password has been successfully reset.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  if (status === 'error' && !formData.token) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Link</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">This password reset link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-india/5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-navy-chakra">Set New Password</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Enter your new password below</p>
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <div className="bg-green-india-light text-green-india-dark p-4 rounded-xl mb-6 border border-green-india/20 font-medium text-sm leading-relaxed">
                {message}
              </div>
              <p className="text-xs text-slate-400 font-semibold animate-pulse">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-saffron/10 text-sm font-bold text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
