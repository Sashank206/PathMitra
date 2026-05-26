import { Link } from 'react-router-dom';
import { Briefcase, MessageCircle, Share2, Globe, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-navy-chakra text-slate-300 border-t border-slate-900 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_400px)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(21,128,61,0.05),transparent_400px)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-saffron to-green-india p-1.5 rounded-lg">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Path Mitra
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              {t('footer.desc')}
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-l-2 border-green-india pl-3">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-3 text-sm font-sans font-semibold">
              <li><Link to="/jobs?category=govt" className="hover:text-saffron transition-colors">{t('footer.govtJobs')}</Link></li>
              <li><Link to="/jobs?category=private" className="hover:text-saffron transition-colors">{t('footer.privateJobs')}</Link></li>
              <li><Link to="/jobs?category=self-employment" className="hover:text-saffron transition-colors">{t('footer.selfEmployment')}</Link></li>
              <li><Link to="/guide" className="hover:text-saffron transition-colors">{t('footer.counseling')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-l-2 border-saffron pl-3">{t('footer.linksTitle')}</h3>
            <ul className="space-y-3 text-sm font-sans font-semibold">
              <li><Link to="/" className="hover:text-saffron transition-colors">{t('footer.homeLink')}</Link></li>
              <li><Link to="/guide" className="hover:text-saffron transition-colors">{t('footer.guideLink')}</Link></li>
              <li><Link to="/jobs" className="hover:text-saffron transition-colors">{t('footer.jobsLink')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-saffron transition-colors">{t('footer.dashboardLink')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 border-l-2 border-chakra pl-3">{t('footer.connectTitle')}</h3>
            <p className="text-sm text-slate-400 mb-4 font-sans">{t('footer.connectDesc')}</p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-saffron hover:text-white rounded-lg transition-all"><Globe size={18} /></a>
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-saffron hover:text-white rounded-lg transition-all"><MessageCircle size={18} /></a>
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-saffron hover:text-white rounded-lg transition-all"><Share2 size={18} /></a>
              <a href="#" className="p-2 bg-slate-800/50 hover:bg-saffron hover:text-white rounded-lg transition-all"><Mail size={18} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 text-xs text-center text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
          <div className="flex space-x-6 text-slate-600 font-bold">
            <a href="#" className="hover:text-slate-400">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-slate-400">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
