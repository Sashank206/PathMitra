import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, ChevronLeft, Briefcase, GraduationCap, Globe,
  Building2, TrendingUp, Users, Calendar, Compass, Lightbulb,
  MapPin, Wrench, Laptop, FileText, CheckCircle, Bookmark, IndianRupee, Clock,
  Shield, BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

// ── All 5 guided questions based on PGRKAM problem statement ──
const questions = [
  {
    id: 'user_type',
    question: 'Who are you?',
    subtitle: 'Help us understand your current situation so we can guide you better.',
    icon: <Users className="text-saffron" size={28} />,
    options: [
      { label: 'Job Seeker', desc: 'Looking for employment opportunities' },
      { label: 'Student / Fresher', desc: 'Recently graduated or still studying' },
      { label: 'Employed (Looking to Switch)', desc: 'Currently working, want better options' },
      { label: 'Entrepreneur / Self-Employed', desc: 'Running or want to start a business' },
    ]
  },
  {
    id: 'qualification',
    question: 'What is your highest qualification?',
    subtitle: 'Your education level helps us filter the right eligibility-based opportunities.',
    icon: <GraduationCap className="text-saffron" size={28} />,
    options: [
      { label: '8th / 10th Pass', desc: 'Up to secondary school education' },
      { label: '12th Pass', desc: 'Senior secondary / HSC completed' },
      { label: 'Diploma / ITI', desc: 'Technical or vocational certification' },
      { label: 'Graduate (B.A / B.Sc / B.Com / B.Tech)', desc: 'Bachelor\'s degree completed' },
      { label: 'Post Graduate (M.A / M.Sc / MBA)', desc: 'Master\'s degree or higher' },
    ]
  },
  {
    id: 'experience',
    question: 'What is your work experience?',
    subtitle: 'Experience helps us match you with the right level of opportunities.',
    icon: <Briefcase className="text-saffron" size={28} />,
    options: [
      { label: 'No Experience (Fresher)', desc: 'Just starting out' },
      { label: 'Less than 1 Year', desc: 'Some internship or part-time work' },
      { label: '1–3 Years', desc: 'Junior level experience' },
      { label: '3–5 Years', desc: 'Mid-level professional' },
      { label: '5+ Years', desc: 'Senior / experienced professional' },
    ]
  },
  {
    id: 'location_preference',
    question: 'Where do you prefer to work?',
    subtitle: 'Location preference helps narrow down the most relevant opportunities.',
    icon: <MapPin className="text-saffron" size={28} />,
    options: [
      { label: 'My Home State / City', desc: 'Local opportunities only' },
      { label: 'Anywhere in India', desc: 'Open to relocation within India' },
      { label: 'Remote / Work from Home', desc: 'Online or home-based work' },
      { label: 'Abroad / International', desc: 'Interested in foreign opportunities' },
    ]
  },
  {
    id: 'interest',
    question: 'What type of opportunity are you looking for?',
    subtitle: 'Your career goal helps us point you to exactly the right module.',
    icon: <Lightbulb className="text-saffron" size={28} />,
    options: [
      { label: 'Government / Public Sector Job', desc: 'PSU, Railways, Banking, Defence etc.' },
      { label: 'Private Sector Job', desc: 'Corporate, IT, Retail, Manufacturing' },
      { label: 'Start My Own Business', desc: 'Self-employment, MSME schemes, funding' },
      { label: 'Work or Study Abroad', desc: 'Foreign jobs, scholarships, visa guidance' },
      { label: 'Skill Development / Training', desc: 'Courses, certifications, workshops' },
      { label: 'Join Armed Forces', desc: 'Army, Navy, Air Force, Police, Paramilitary' },
      { label: 'Job Mela / Walk-in Drive', desc: 'Instant hiring events near me' },
      { label: 'Career Counseling', desc: 'I\'m confused and need professional advice' },
    ]
  }
];

// ── Smart recommendation engine ──
const getRecommendation = (answers) => {
  const interest = answers.interest;
  const location = answers.location_preference;

  if (interest === 'Government / Public Sector Job') {
    return {
      title: 'Government Jobs Portal',
      path: '/jobs?category=govt',
      category: 'govt',
      icon: <Building2 size={40} />,
      color: 'saffron',
      description: 'Browse the latest verified government job openings from ministries, railways, PSUs, and banking sectors that match your qualification.',
      tips: ['Filter by state or All-India posts', 'Check eligibility requirements carefully', 'Apply before the deadline listed'],
    };
  }
  if (interest === 'Work or Study Abroad') {
    return {
      title: 'Foreign Opportunities & Study',
      path: '/jobs?category=foreign',
      category: 'foreign',
      icon: <Globe size={40} />,
      color: 'green-india',
      description: 'Explore verified international job placements with visa sponsorship, foreign study scholarships, and overseas relocation support.',
      tips: ['Verify the recruiter credentials', 'Check visa and work permit requirements', 'Connect with our foreign placement counselors'],
    };
  }
  if (interest === 'Start My Own Business') {
    return {
      title: 'Self Employment & Schemes',
      path: '/jobs?category=self-employment',
      category: 'self-employment',
      icon: <TrendingUp size={40} />,
      color: 'navy-chakra',
      description: 'Access government-backed self-employment schemes, MSME loans, startup funding programs and business registration assistance.',
      tips: ['Explore PMEGP, Mudra, and Startup India schemes', 'Attend our entrepreneur orientation sessions', 'Get connected with district-level MSME offices'],
    };
  }
  if (interest === 'Skill Development / Training') {
    return {
      title: 'Skill Development Programs',
      path: '/jobs?search=Training',
      category: 'self-employment',
      search: 'Training',
      icon: <GraduationCap size={40} />,
      color: 'green-india',
      description: 'Enroll in industry-aligned certification courses under Skill India, NSDC, and state-sponsored programs to boost your employability.',
      tips: ['Choose courses aligned with your target sector', 'Look for courses with placement assistance', 'Earn a recognized certificate to add to your resume'],
    };
  }
  if (interest === 'Join Armed Forces') {
    return {
      title: 'Armed Forces Recruitment',
      path: '/jobs?search=Army',
      category: 'govt',
      search: 'Army',
      icon: <Shield size={40} />,
      color: 'saffron',
      description: 'Find recruitment rallies, written examination schedules and eligibility details for Army, Navy, Air Force, Police and Paramilitary forces.',
      tips: ['Check physical fitness standards early', 'Prepare for written CBT exams', 'Follow official recruitment boards for dates'],
    };
  }
  if (interest === 'Job Mela / Walk-in Drive') {
    return {
      title: 'Job Melas & Walk-in Drives',
      path: '/jobs?search=Mela',
      category: 'private',
      search: 'Mela',
      icon: <Calendar size={40} />,
      color: 'green-india',
      description: 'Find upcoming job fairs, walk-in hiring drives, and instant placement events near your location organized by state employment departments.',
      tips: ['Carry 5 copies of your resume and ID proof', 'Arrive early to avoid long queues', 'Dress professionally and be prepared for on-spot interviews'],
    };
  }
  if (interest === 'Career Counseling') {
    return {
      title: 'Career Counseling & Guidance',
      path: '/guide',
      category: 'self-employment',
      icon: <Users size={40} />,
      color: 'saffron',
      description: 'Book a one-on-one session with a certified career counselor who can help you map out a personalized career roadmap based on your profile.',
      tips: ['Prepare a list of your skills and interests', 'Be honest about your current situation', 'Follow up on action items given by your counselor'],
    };
  }
  // Default: Private Sector
  if (location === 'Remote / Work from Home') {
    return {
      title: 'Remote & Freelance Jobs',
      path: '/jobs?category=private',
      category: 'private',
      icon: <Laptop size={40} />,
      color: 'navy-chakra',
      description: 'Discover remote-friendly positions, freelance projects and work-from-home opportunities in the private sector that match your experience.',
      tips: ['Highlight remote work skills (communication, self-management)', 'Build a portfolio for freelance clients', 'Use our resume builder to target WFH roles'],
    };
  }
  return {
    title: 'Private Sector Jobs',
    path: '/jobs?category=private',
    category: 'private',
    icon: <Briefcase size={40} />,
    color: 'green-india',
    description: 'Explore thousands of verified openings across IT, manufacturing, retail, banking, and other private sector industries.',
    tips: ['Use filters to narrow by location and salary', 'Apply early as private jobs fill fast', 'Customize your resume for each application'],
  };
};

const colorMap = {
  'saffron': 'bg-saffron/10 text-saffron-dark border-saffron/20',
  'green-india': 'bg-green-india/10 text-green-india-dark border-green-india/20',
  'navy-chakra': 'bg-navy-chakra/5 text-navy-chakra border-navy-chakra/10',
};

const GuidedNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option.label });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (isComplete) { setIsComplete(false); return; }
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsComplete(false);
  };

  const [matchingJobs, setMatchingJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const rec = isComplete ? getRecommendation(answers) : null;

  const fetchMatchingJobs = useCallback(async (category, search) => {
    setLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const response = await api.get(`/jobs?${params.toString()}`);
      const data = response.data.data || response.data;
      setMatchingJobs(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (err) {
      console.error('Failed to fetch matched jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const fetchUserStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const savedRes = await api.get('/saved-jobs');
      setSavedJobIds(new Set(savedRes.data.map(j => j._id || j.id)));

      const appliedRes = await api.get('/applications');
      setAppliedJobIds(new Set(appliedRes.data.map(app => app.job?._id || app.job?.id || app.job_id)));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isComplete && rec) {
      fetchMatchingJobs(rec.category, rec.search);
      fetchUserStatus();
    }
  }, [isComplete, rec?.category, rec?.search, fetchMatchingJobs, fetchUserStatus]);

  const handleSaveToggle = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await api.delete(`/jobs/${jobId}/unsave`);
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await api.post(`/jobs/${jobId}/save`);
        setSavedJobIds(prev => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });
      }
    } catch (err) {
      alert('Failed to modify bookmarks.');
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (appliedJobIds.has(jobId)) return;
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setAppliedJobIds(prev => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });
      alert('Applied successfully! You can track status on your dashboard.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  const progress = isComplete ? 100 : ((currentStep) / questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Page header */}
      <div className="bg-gradient-to-r from-navy-chakra via-slate-950 to-navy-chakra py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron rounded-full blur-[120px] opacity-10 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-india rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron/10 border border-saffron/20 text-saffron text-sm font-semibold mb-4">
            <Compass size={15} /> Guided Navigation System
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Smart Career Guide</h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Answer {questions.length} quick questions to instantly identify the exact government schemes or placement modules tailored to your background.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold">
            <span>{isComplete ? '✅ Analysis Complete' : `Step ${currentStep + 1} of ${questions.length}`}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-saffron rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex gap-1.5 mt-3">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${isComplete || idx < currentStep
                    ? 'bg-green-india'
                    : idx === currentStep
                      ? 'bg-saffron'
                      : 'bg-slate-200'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.25 }}
                className="p-8 md:p-10"
              >
                {/* Question header */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-saffron-light/50 rounded-xl flex items-center justify-center">
                    {questions[currentStep].icon}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-saffron uppercase tracking-widest mb-0.5">Question {currentStep + 1}</p>
                    <h2 className="text-xl md:text-2xl font-extrabold text-navy-chakra leading-tight">{questions[currentStep].question}</h2>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-8 ml-16 leading-relaxed font-medium">{questions[currentStep].subtitle}</p>

                <div className="grid grid-cols-1 gap-3">
                  {questions[currentStep].options.map((option) => {
                    const isSelected = answers[questions[currentStep].id] === option.label;
                    return (
                      <button
                        key={option.label}
                        onClick={() => handleSelect(option)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                            ? 'border-saffron bg-saffron-light/10 shadow-md shadow-saffron/5'
                            : 'border-slate-100 hover:border-saffron/40 hover:bg-slate-50/50'
                          }`}
                      >
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <p className={`font-bold text-sm ${isSelected ? 'text-saffron-dark' : 'text-navy-chakra/90'}`}>{option.label}</p>
                            <p className={`text-xs mt-0.5 font-medium ${isSelected ? 'text-saffron' : 'text-slate-500'}`}>{option.desc}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-saffron bg-saffron' : 'border-slate-300'
                            }`}>
                            {isSelected && <Check size={13} className="text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-10"
              >
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl border-2 ${colorMap[rec.color]} mb-5`}>
                    {rec.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-navy-chakra mb-2">We found your match!</h2>
                  <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">Based on your answers, here is the most relevant module for your profile:</p>
                </div>

                {/* Recommended module card */}
                <div className={`rounded-2xl border p-6 mb-6 shadow-sm ${colorMap[rec.color]}`}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Recommended Module</p>
                  <h3 className="text-xl font-extrabold mb-2">{rec.title}</h3>
                  <p className="text-sm leading-relaxed font-medium opacity-90">{rec.description}</p>
                </div>

                {/* Tips */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-6">
                  <p className="text-sm font-bold text-navy-chakra mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-saffron" /> Quick Tips for You</p>
                  <ul className="space-y-2">
                    {rec.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed font-medium">
                        <CheckCircle size={16} className="text-green-india mt-0.5 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Matching Opportunities */}
                <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-sm font-extrabold text-navy-chakra uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Briefcase size={16} className="text-saffron shrink-0" /> Live Matches Tailored for You
                  </h3>

                  {loadingJobs ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                    </div>
                  ) : matchingJobs.length === 0 ? (
                    <p className="text-slate-500 text-xs italic">No active openings listed in this category right now.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {matchingJobs.map(job => {
                        const jobId = job.id || job._id;
                        const isSaved = savedJobIds.has(jobId);
                        const isApplied = appliedJobIds.has(jobId);

                        return (
                          <div key={jobId} className="bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-saffron/30 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h4 className="font-extrabold text-navy-chakra text-sm leading-snug">{job.title}</h4>
                                <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-saffron-light text-saffron-dark border border-saffron/10">{job.type}</span>
                              </div>
                              <p className="text-xs text-slate-500 font-bold mb-1.5">{job.company} — <span className="text-slate-400 font-semibold">{job.location}</span></p>
                              {job.salary_range && (
                                <p className="text-xs text-green-india font-extrabold flex items-center gap-1"><IndianRupee size={12} /> {job.salary_range}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => handleSaveToggle(jobId)}
                                className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${isSaved
                                    ? 'bg-green-india/10 text-green-india border-green-india/30'
                                    : 'bg-white text-slate-600 border-slate-200 hover:text-saffron hover:border-saffron/20'
                                  }`}
                                title={isSaved ? "Saved" : "Save Opportunity"}
                              >
                                <Bookmark size={13} className={isSaved ? "fill-green-india" : ""} />
                              </button>

                              <button
                                onClick={() => handleApply(jobId)}
                                disabled={isApplied}
                                className={`px-5 py-2.5 rounded-xl font-extrabold transition-all text-xs hover:-translate-y-0.5 ${isApplied
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                                    : 'bg-gradient-to-r from-saffron to-saffron-hover text-white hover:shadow-md hover:shadow-saffron/20'
                                  }`}
                              >
                                {isApplied ? 'Applied' : 'Apply Now'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Profile Summary */}
                <div className="bg-gradient-to-tr from-saffron-light/20 to-green-india-light/20 border border-slate-200 rounded-2xl p-5 mb-8">
                  <p className="text-xs font-bold text-navy-chakra uppercase tracking-widest mb-3 border-b border-slate-200/50 pb-2">Your Profile Summary</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {Object.entries(answers).map(([key, val]) => (
                      <div key={key} className="text-xs font-medium flex justify-between sm:justify-start gap-1">
                        <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}: </span>
                        <span className="text-navy-chakra font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate(rec.path)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-saffron to-saffron-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-saffron/20 hover:-translate-y-0.5"
                  >
                    Go to {rec.title} <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl font-semibold transition-all hover:bg-slate-50"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav footer */}
          {!isComplete && (
            <div className="px-8 md:px-10 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[questions[currentStep].id]}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!answers[questions[currentStep].id]
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-saffron to-saffron-hover text-white hover:shadow-lg hover:shadow-saffron/20 hover:-translate-y-0.5'
                  }`}
              >
                {currentStep === questions.length - 1 ? 'Show My Results' : 'Next'} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Bottom help links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-4 font-semibold">Not sure? You can also directly browse:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'All Jobs', path: '/jobs' },
              { label: 'Govt Jobs', path: '/jobs?category=govt' },
              { label: 'Private Jobs', path: '/jobs?category=private' },
              { label: 'Foreign Jobs', path: '/jobs?category=foreign' },
            ].map(link => (
              <Link
                key={link.label}
                to={link.path}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-saffron hover:text-saffron rounded-full text-xs font-bold text-navy-chakra/80 shadow-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedNavigation;
