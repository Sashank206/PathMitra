import { Link } from 'react-router-dom';
import { ArrowRight, Search, Compass, GraduationCap, Building2, Globe, Users, TrendingUp, Briefcase, Calendar, FileText, Video, BrainCircuit, Wrench, Laptop, CheckCircle, AlertCircle, Lightbulb, Shield, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const painPoints = [
    { icon: <AlertCircle className="text-saffron" size={20} />, text: t('home.challenge1') },
    { icon: <AlertCircle className="text-saffron" size={20} />, text: t('home.challenge2') },
    { icon: <AlertCircle className="text-saffron" size={20} />, text: t('home.challenge3') },
  ];

  const solutions = [
    { icon: <CheckCircle className="text-green-india" size={20} />, text: t('home.solution1') },
    { icon: <CheckCircle className="text-green-india" size={20} />, text: t('home.solution2') },
    { icon: <CheckCircle className="text-green-india" size={20} />, text: t('home.solution3') },
  ];

  const services = [
    { title: t('home.services.govtTitle'), icon: <Building2 size={22} />, desc: t('home.services.govtDesc'), color: 'saffron', path: '/jobs?category=govt' },
    { title: t('home.services.privateTitle'), icon: <Briefcase size={22} />, desc: t('home.services.privateDesc'), color: 'green-india', path: '/jobs?category=private' },
    { title: t('home.services.selfEmploymentTitle'), icon: <TrendingUp size={22} />, desc: t('home.services.selfEmploymentDesc'), color: 'navy-chakra', path: '/jobs?category=self-employment' },
    { title: t('home.services.foreignPlacementsTitle'), icon: <Globe size={22} />, desc: t('home.services.foreignPlacementsDesc'), color: 'chakra', path: '/jobs?category=foreign' },
    { title: t('home.services.foreignStudyTitle'), icon: <BookOpen size={22} />, desc: t('home.services.foreignStudyDesc'), color: 'green-india', path: '/jobs?search=Scholarship' },
    { title: t('home.services.armedForcesTitle'), icon: <Shield size={22} />, desc: t('home.services.armedForcesDesc'), color: 'saffron', path: '/jobs?search=Army' },
    { title: t('home.services.skillDevelopmentTitle'), icon: <GraduationCap size={22} />, desc: t('home.services.skillDevelopmentDesc'), color: 'green-india', path: '/jobs?search=Training' },
    { title: t('home.services.counselingTitle'), icon: <Users size={22} />, desc: t('home.services.counselingDesc'), color: 'saffron', path: '/guide' },
    { title: t('home.services.jobMelasTitle'), icon: <Calendar size={22} />, desc: t('home.services.jobMelasDesc'), color: 'chakra', path: '/jobs?search=Mela' },
    { title: t('home.services.resumeBuilderTitle'), icon: <FileText size={22} />, desc: t('home.services.resumeBuilderDesc'), color: 'navy-chakra', path: '/dashboard?tab=resume' },
    { title: t('home.services.interviewPrepTitle'), icon: <Video size={22} />, desc: t('home.services.interviewPrepDesc'), color: 'saffron', path: '/guide' },
    { title: t('home.services.careerAssessmentsTitle'), icon: <BrainCircuit size={22} />, desc: t('home.services.careerAssessmentsDesc'), color: 'green-india', path: '/guide' },
    { title: t('home.services.apprenticeshipsTitle'), icon: <Wrench size={22} />, desc: t('home.services.apprenticeshipsDesc'), color: 'navy-chakra', path: '/jobs?search=Apprentice' },
    { title: t('home.services.freelanceTitle'), icon: <Laptop size={22} />, desc: t('home.services.freelanceDesc'), color: 'chakra', path: '/jobs?search=Freelance' },
  ];

  const getColorStyles = (color) => {
    switch (color) {
      case 'saffron':
        return {
          iconBg: 'bg-saffron/10 text-saffron group-hover:bg-saffron group-hover:text-white',
          textLink: 'text-saffron hover:text-saffron-dark'
        };
      case 'green-india':
        return {
          iconBg: 'bg-green-india/10 text-green-india group-hover:bg-green-india group-hover:text-white',
          textLink: 'text-green-india hover:text-green-india-dark'
        };
      case 'navy-chakra':
        return {
          iconBg: 'bg-navy-chakra/10 text-navy-chakra group-hover:bg-navy-chakra group-hover:text-white',
          textLink: 'text-navy-chakra hover:text-navy-chakra-hover'
        };
      case 'chakra':
        return {
          iconBg: 'bg-chakra/10 text-chakra group-hover:bg-chakra group-hover:text-white',
          textLink: 'text-chakra hover:text-blue-700'
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white',
          textLink: 'text-slate-600 hover:text-slate-800'
        };
    }
  };

  const steps = [
    { num: '01', title: t('home.howItWorks.step1Title'), desc: t('home.howItWorks.step1Desc') },
    { num: '02', title: t('home.howItWorks.step2Title'), desc: t('home.howItWorks.step2Desc') },
    { num: '03', title: t('home.howItWorks.step3Title'), desc: t('home.howItWorks.step3Desc') },
  ];

  return (
    <div className="bg-slate-50">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-chakra via-slate-950 to-navy-chakra pt-28 pb-36">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        {/* Patriotic glowing ambient nodes */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-saffron rounded-full blur-[130px] opacity-10 -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-green-india rounded-full blur-[110px] opacity-15 translate-y-1/3 -translate-x-1/4 animate-pulse-slow"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-sm font-semibold mb-8">
                <Compass size={15} /> {t('home.hero.badge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                {t('home.hero.title1')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-white to-green-india">
                  {t('home.hero.title2')}
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-4 leading-relaxed">
                {t('home.hero.desc')}
              </p>
              <div className="text-sm text-slate-300 mb-10 leading-relaxed border-l-2 border-saffron pl-4 bg-white/5 py-2.5 pr-4 rounded-r-lg">
                {t('home.hero.quote')}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/guide" className="px-8 py-4 bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/30 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  <Compass size={20} /> {t('home.hero.btnGuide')}
                </Link>
                <Link to="/jobs" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 backdrop-blur-sm">
                  <Search size={20} /> {t('home.hero.btnJobs')}
                </Link>
              </div>
            </motion.div>

            {/* Problem vs Solution card */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-saffron to-transparent opacity-10 rounded-full blur-xl animate-pulse"></div>
                <div className="mb-8">
                  <p className="text-xs font-extrabold text-saffron uppercase tracking-widest mb-4 flex items-center gap-2">
                    <AlertCircle size={16} /> {t('home.challengeTitle')}
                  </p>
                  <div className="space-y-3.5">
                    {painPoints.map((p, i) => (
                      <div key={i} className="flex items-start gap-3.5 text-slate-300 text-sm leading-relaxed">
                        <div className="mt-0.5">{p.icon}</div>
                        <span>{p.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs font-extrabold text-green-india uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Lightbulb className="text-green-india" size={16} /> {t('home.solutionTitle')}
                  </p>
                  <div className="space-y-3.5">
                    {solutions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3.5 text-slate-300 text-sm leading-relaxed">
                        <div className="mt-0.5">{s.icon}</div>
                        <span>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-india/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-saffron-light text-saffron-dark text-xs font-bold uppercase tracking-widest rounded-full mb-4 shadow-sm">
              {t('home.howItWorks.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-chakra mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              {t('home.howItWorks.desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-saffron/20 transition-all duration-300"
              >
                <div className="text-6xl font-black text-slate-200/50 absolute top-6 right-6 select-none">{step.num}</div>
                <div className="w-12 h-12 bg-gradient-to-tr from-saffron to-saffron-hover rounded-xl flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md shadow-saffron/20">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-navy-chakra mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-green-india rounded-full items-center justify-center shadow-lg">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/guide" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron to-saffron-hover text-white rounded-xl font-bold shadow-lg shadow-saffron/20 transition-all hover:-translate-y-0.5">
              <Compass size={20} /> {t('home.howItWorks.btnTry')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-india-light text-green-india-dark text-xs font-bold uppercase tracking-widest rounded-full mb-4 shadow-sm">
              {t('home.grid.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-chakra mb-4">
              {t('home.grid.title')}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              {t('home.grid.desc')}
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {services.map((service, index) => {
              const styles = getColorStyles(service.color);
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    to={service.path}
                    className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-saffron/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${styles.iconBg}`}>
                      {service.icon}
                    </div>
                    <h3 className="text-base font-bold text-navy-chakra mb-1.5 group-hover:text-saffron transition-colors">{service.title}</h3>
                    <p className="text-slate-500 text-xs flex-grow leading-relaxed font-medium">{service.desc}</p>
                    <div className={`text-xs font-bold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all ${styles.textLink}`}>
                      Explore <ArrowRight size={13} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-24 bg-gradient-to-r from-saffron via-navy-chakra to-green-india relative overflow-hidden shadow-xl text-white">
        <div className="absolute inset-0 bg-slate-950/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: '12+', label: t('home.stats.modules') },
              { val: '50k+', label: t('home.stats.jobs') },
              { val: '1.2L+', label: t('home.stats.seekers') },
              { val: '98%', label: t('home.stats.rate') },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{s.val}</div>
                <div className="text-white/80 font-semibold text-xs uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIDE CTA ── */}
      <section className="py-28 bg-navy-chakra relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(21,128,61,0.08),transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 bg-saffron/10 border border-saffron/20 text-saffron text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              {t('home.cta.badge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              {t('home.cta.title1')}<br />{t('home.cta.title2')}
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/guide" className="px-10 py-4 bg-gradient-to-r from-saffron to-saffron-hover text-white rounded-xl font-bold text-lg shadow-2xl shadow-saffron/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Compass size={22} /> {t('home.cta.btnGuide')}
              </Link>
              <Link to="/register" className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-sm">
                {t('home.cta.btnAccount')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
