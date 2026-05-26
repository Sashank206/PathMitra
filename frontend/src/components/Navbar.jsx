import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, User, Menu, X, LayoutDashboard, LogOut, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-tr from-saffron to-green-india p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-saffron via-navy-chakra to-green-india">
                Path Mitra
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-semibold transition-all relative py-2 ${
                isActive('/') 
                  ? 'text-saffron after:w-full' 
                  : 'text-navy-chakra/70 hover:text-saffron after:w-0'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-saffron after:transition-all hover:after:w-full`}
            >
              {t('navbar.home')}
            </Link>
            <Link 
              to="/guide" 
              className={`font-semibold transition-all relative py-2 ${
                isActive('/guide') 
                  ? 'text-saffron after:w-full' 
                  : 'text-navy-chakra/70 hover:text-saffron after:w-0'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-saffron after:transition-all hover:after:w-full`}
            >
              {t('navbar.careerGuide')}
            </Link>
            <Link 
              to="/jobs" 
              className={`font-semibold transition-all relative py-2 ${
                isActive('/jobs') 
                  ? 'text-saffron after:w-full' 
                  : 'text-navy-chakra/70 hover:text-saffron after:w-0'
              } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-saffron after:transition-all hover:after:w-full`}
            >
              {t('navbar.jobs')}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-navy-chakra/70 gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-saffron focus-within:ring-1 focus-within:ring-saffron transition-all">
              <Globe size={15} />
              <select 
                value={i18n.language || 'en'}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  localStorage.setItem('i18nextLng', e.target.value);
                }}
                className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer outline-none text-navy-chakra/80 py-0 pr-6"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="pa">Punjabi</option>
              </select>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-navy-chakra/60 bg-slate-100 px-3 py-1 rounded-full">{t('navbar.greeting', { name: user.name })}</span>
                <Link to="/dashboard" className="text-navy-chakra/80 hover:text-saffron font-semibold transition-colors flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-lg hover:bg-saffron-light">
                  <LayoutDashboard size={16} /> {t('navbar.dashboard')}
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 py-1.5 px-3 rounded-lg font-semibold transition-all flex items-center gap-1.5 text-sm">
                  <LogOut size={16} /> {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-navy-chakra/80 hover:text-saffron font-semibold transition-colors text-sm">
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/30 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  <User size={16} />
                  {t('navbar.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy-chakra hover:text-saffron transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 py-4 px-4 space-y-4 shadow-lg absolute w-full left-0 z-50">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-navy-chakra/80 hover:text-saffron font-semibold">{t('navbar.home')}</Link>
          <Link to="/guide" onClick={() => setIsOpen(false)} className="block text-navy-chakra/80 hover:text-saffron font-semibold">{t('navbar.careerGuide')}</Link>
          <Link to="/jobs" onClick={() => setIsOpen(false)} className="block text-navy-chakra/80 hover:text-saffron font-semibold">{t('navbar.jobs')}</Link>
          
          <div className="border-t border-slate-100 my-2 pt-2"></div>

          <div className="flex items-center text-navy-chakra/70 gap-2 py-2">
            <Globe size={18} />
            <select 
              value={i18n.language || 'en'}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                localStorage.setItem('i18nextLng', e.target.value);
              }}
              className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer outline-none text-navy-chakra/80"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="pa">Punjabi</option>
            </select>
          </div>
          
          <div className="border-t border-slate-100 my-2 pt-2"></div>
          
          {user ? (
            <div className="space-y-3">
              <span className="block text-xs font-semibold text-navy-chakra/60 bg-slate-100 px-3 py-1.5 rounded-lg">{t('navbar.greeting', { name: user.name })}</span>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-saffron font-semibold flex items-center gap-2"><LayoutDashboard size={18} /> {t('navbar.dashboard')}</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block text-red-600 font-semibold w-full text-left flex items-center gap-2"><LogOut size={18} /> {t('navbar.logout')}</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2.5 text-navy-chakra/80 hover:text-saffron font-semibold text-sm border border-slate-200 rounded-full">
                {t('navbar.login')}
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-2.5 bg-gradient-to-r from-saffron to-saffron-hover text-white font-bold text-sm rounded-full shadow-md shadow-saffron/20">
                {t('navbar.register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
