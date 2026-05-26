import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    
    try {
      const response = await api.post('/forgot-password', { email });
      setStatus('success');
      setMessage(response.data.message || 'If an account with that email exists, we have sent a password reset link.');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to process request. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-india/5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-navy-chakra">Reset Password</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Enter your email to receive a password reset link</p>
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <div className="bg-green-india-light text-green-india-dark p-4 rounded-xl mb-6 border border-green-india/20 font-medium text-sm leading-relaxed">
                {message}
              </div>
              <Link to="/login" className="text-saffron font-bold hover:text-saffron-dark flex items-center justify-center text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium"
                    placeholder="name@domain.com"
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
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <div className="text-center mt-6">
                <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-navy-chakra flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
