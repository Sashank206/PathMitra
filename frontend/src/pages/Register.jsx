import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../utils/api';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Custom Validation Logic
    let errors = { name: '', email: '', password: '', password_confirmation: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password.';
      isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match.';
      isValid = false;
    }

    setValidationErrors(errors);
    if (!isValid) return;

    setLoading(true);

    try {
      await api.post('/register', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
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
            <h2 className="text-2xl font-black text-navy-chakra">{t('register.title')}</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">{t('register.subtitle')}</p>
          </div>

          {success ? (
            <div className="text-center py-8 animate-in zoom-in-95 duration-200">
              <div className="mx-auto w-16 h-16 bg-green-india-light text-green-india rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-navy-chakra mb-2">{t('register.checkEmail')}</h3>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
                {t('register.verificationSent', { email: formData.email })}
              </p>
              <Link
                to="/login"
                className="inline-flex justify-center px-6 py-3.5 border border-transparent rounded-xl shadow-lg shadow-saffron/10 text-sm font-bold text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/25 transition-all hover:-translate-y-0.5"
              >
                {t('register.goToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t('register.nameLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (validationErrors.name) setValidationErrors({...validationErrors, name: ''});
                      }}
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium ${
                        validationErrors.name ? 'border-red-400 bg-red-50/10' : 'border-slate-200'
                      }`}
                      placeholder="User Name"
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t('register.emailLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) setValidationErrors({...validationErrors, email: ''});
                      }}
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium ${
                        validationErrors.email ? 'border-red-400 bg-red-50/10' : 'border-slate-200'
                      }`}
                      placeholder="username@gmail.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t('register.passwordLabel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t('register.confirmPassword')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => {
                        setFormData({ ...formData, password_confirmation: e.target.value });
                        if (validationErrors.password_confirmation) setValidationErrors({...validationErrors, password_confirmation: ''});
                      }}
                      className={`block w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium ${
                        validationErrors.password_confirmation ? 'border-red-400 bg-red-50/10' : 'border-slate-200'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {validationErrors.password_confirmation && (
                    <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{validationErrors.password_confirmation}</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-saffron/10 text-sm font-bold text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron transition-all hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? t('register.signingUp') : t('register.signUpBtn')}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-500 font-semibold">
                {t('register.alreadyHaveAccount')}{' '}
                <Link to="/login" className="font-bold text-saffron hover:text-saffron-dark">
                  {t('register.signInLink')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
