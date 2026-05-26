import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../utils/api';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setUnverified(false);
    
    // Custom Validation Logic
    let errors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      errors.email = 'Email address is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address (e.g. name@gmail.com).';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setValidationErrors(errors);
    if (!isValid) return;

    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      const loggedInUser = response.data.user;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      if (loggedInUser.role === 'admin' || loggedInUser.phone_verified_at) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      if (err.response?.data?.unverified) {
        setUnverified(true);
      }
      setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const response = await api.post('/email/verification-notification', { email });
      setResendMessage(response.data.message || 'Verification link sent!');
    } catch (err) {
      setResendMessage(err.response?.data?.message || 'Failed to send link.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-india/5 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-saffron to-green-india rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-saffron/20 animate-float">
              <Briefcase className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-navy-chakra">{t('login.title')}</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t('login.emailLabel')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors({...validationErrors, email: ''});
                  }}
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium ${
                    validationErrors.email ? 'border-red-400 bg-red-50/10' : 'border-slate-200'
                  }`}
                  placeholder="name@gmail.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">{t('login.passwordLabel')}</label>
                <Link to="/forgot-password" className="text-xs font-bold text-saffron hover:text-saffron-dark">{t('login.forgotPassword')}</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors({...validationErrors, password: ''});
                  }}
                  className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium ${
                    validationErrors.password ? 'border-red-400 bg-red-50/10' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{validationErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex flex-col font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                <span>{error}</span>
                {unverified && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="mt-2 text-left font-bold text-red-700 hover:text-red-800 underline decoration-red-300 underline-offset-2"
                  >
                    {resendLoading ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
                {resendMessage && (
                  <span className="mt-2 text-green-600 font-bold">{resendMessage}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-saffron/10 text-sm font-bold text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? t('login.signingIn') : t('login.signInBtn')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-semibold">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="font-bold text-saffron hover:text-saffron-dark">
              {t('login.createAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
