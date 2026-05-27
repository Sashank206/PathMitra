import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Building2, X, Bookmark, Check } from 'lucide-react';
import api from '../utils/api';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);

  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);

  const isAdmin = user?.role === 'admin';

  const getJobDetails = (job) => {
    if (!job) return null;
    const title = job.title || '';
    
    if (title.includes('Punjab Administrative Service')) {
      return {
        requirements: [
          'Must hold a Bachelor\'s degree in any discipline from a recognized university.',
          'Must be aged between 21 and 37 years (relaxation for reserved categories).',
          'Must have passed Punjabi at Matriculation (10th) level or equivalent.',
          'Must clear the PPSC Preliminary and Main written examinations followed by interview.'
        ],
        duties: [
          'Formulating, implementing, and monitoring government policies at the subdivision or district level.',
          'Maintaining law and order in coordination with police forces and judicial magistrates.',
          'Overseeing rural development schemes, land revenue administration, and public grievances.',
          'Coordinating disaster relief operations and managing regional administrative staff.'
        ],
        about: 'The Punjab Public Service Commission is the premier government recruitment agency responsible for selecting civil service officers for administrative leadership.'
      };
    }
    
    if (title.includes('Junior Electrical Engineer')) {
      return {
        requirements: [
          'Three-year Full-Time regular Diploma in Electrical/Electrical & Electronics Engineering with minimum 60% marks.',
          'Passed Punjabi at Matriculation (10th) level or its equivalent.',
          'Age must be between 18 and 37 years.'
        ],
        duties: [
          'Supervising maintenance and repairs of local electrical power grids and transmission lines.',
          'Addressing consumer complaints, voltage irregularities, and billing grievances.',
          'Monitoring energy distribution metrics and scheduling power shutdowns for maintenance safety.',
          'Preparing technical reports and project estimates for infrastructure expansion.'
        ],
        about: 'Punjab State Power Corporation Limited (PSPCL) is the government-owned electricity generation and distribution company of Punjab.'
      };
    }

    if (title.includes('Police Sub-Inspector')) {
      return {
        requirements: [
          'Graduation degree in any discipline from a recognized university or college.',
          'Minimum physical height: 5\' 7" for male candidates, 5\' 2" for female candidates.',
          'Must pass the Physical Screening Test (PST) including 1600m run, high jump, and long jump.',
          'Passed Punjabi at Matriculation level or equivalent.'
        ],
        duties: [
          'Investigating local crimes, taking statements, examining crime scenes, and maintaining case diaries.',
          'Patrolling assigned jurisdictions and leading police constables in law enforcement duties.',
          'Filing First Information Reports (FIRs) and presenting charge sheets in local courts.',
          'Managing public security during rallies, local festivals, and VVIP movements.'
        ],
        about: 'The Punjab Police is the primary law enforcement agency of Punjab, committed to maintaining public safety and controlling crime.'
      };
    }

    if (title.includes('NABARD')) {
      return {
        requirements: [
          'Individual farmers, agricultural entrepreneurs, self-help groups (SHGs), and joint liability groups.',
          'Must have clean credit history and own or lease suitable land for setting up dairy units.',
          'Must possess basic training or experience in dairy animal husbandry.'
        ],
        duties: [
          'Setting up modern infrastructure for 2 to 10 milch animal dairy farming units.',
          'Procuring high-yielding crossbred cows or graded buffaloes.',
          'Utilizing capital subsidy (25% for general, 33.33% for SC/ST) for automated milking systems and fodder cutters.',
          'Maintaining clean milk production standards and coordinating with local milk cooperatives.'
        ],
        about: 'The National Bank for Agriculture and Rural Development (NABARD) operates this scheme to promote self-employment and modern dairy infrastructures in rural sectors.'
      };
    }

    if (title.includes('PMEGP')) {
      return {
        requirements: [
          'Any individual above 18 years of age with at least VIII (8th) standard pass for projects > ₹10 lakhs.',
          'Self-help groups, institutions registered under Societies Registration Act, and cooperative societies.',
          'No income ceiling is applicable for setting up projects under PMEGP.'
        ],
        duties: [
          'Establishing new micro-enterprises in manufacturing or service sectors.',
          'Utilizing bank-financed project loans of up to ₹50 lakhs (manufacturing) or ₹20 lakhs (service).',
          'Managing capital subsidy ranging from 15% to 35% based on location (urban/rural) and applicant category.',
          'Generating employment opportunities for local skilled and semi-skilled workers.'
        ],
        about: 'The Prime Minister\'s Employment Generation Programme (PMEGP) is a credit-linked subsidy scheme administered by the Ministry of MSME to foster entrepreneurship.'
      };
    }

    if (title.includes('NHS') || title.includes('Nurse')) {
      return {
        requirements: [
          'B.Sc Nursing or GNM Diploma with active nursing council registration.',
          'Must have passed IELTS (Academic) with minimum 7.0 score or OET with minimum Grade B.',
          'Must clear NMC Computer Based Test (CBT) and OSCE training stages.',
          'At least 1 year of clinical experience in an acute care setting.'
        ],
        duties: [
          'Delivering high-quality patient care in NHS Trust hospitals and managing clinical records.',
          'Administering prescribed medications, monitoring vitals, and preparing care plans.',
          'Coordinating with multidisciplinary healthcare teams including doctors, nurses, and social workers.',
          'Adhering to strict infection control policies and clinical governance protocols.'
        ],
        about: 'NHS England offers certified, legal, and visa-sponsored nursing placements for qualified international medical professionals with comprehensive relocation support.'
      };
    }

    if (title.includes('Job Mela')) {
      return {
        requirements: [
          'Open to all candidates (freshers and experienced professionals) aged 18 to 45 years.',
          'Educational qualifications ranging from 8th/10th pass up to postgraduates.',
          'Must carry at least 5 physical copies of their updated resume and valid ID proofs (Aadhaar/PAN).'
        ],
        duties: [
          'Participate in face-to-face screening and walk-in interviews with multiple recruiters.',
          'Explore hiring options across sectors like banking, retail, IT, and manufacturing.',
          'Receive direct, on-spot placement offers or second-round interview schedules.'
        ],
        about: 'The Ludhiana Mega Job Mela is a state-sponsored recruitment fair organized by DBEE to bridge the gap between job seekers and active recruiters.'
      };
    }
    
    if (title.includes('Apprentice')) {
      return {
        requirements: [
          'B.E. / B.Tech or Diploma in Electrical or Electronics Engineering completed after 2023.',
          'Must be registered on the National Apprenticeship Promotion Scheme (NAPS) portal.',
          'Candidate must reside in Punjab and satisfy physical fitness metrics.'
        ],
        duties: [
          'Undergo comprehensive field training under senior power grid distribution engineers.',
          'Assist in grid voltage logging, power substation line monitoring, and line load balancing.',
          'Understand and follow high-voltage electric transmission safety codes.'
        ],
        about: 'The Graduate Engineer Apprenticeship scheme is credit-linked by NAPS to provide earn-while-you-learn opportunities for fresh engineering graduates.'
      };
    }

    if (title.includes('Web Developer Training') || title.includes('Course')) {
      return {
        requirements: [
          '12th pass, Diploma, ITI, or Graduate with basic computer literacy.',
          'Must reside in Punjab and carry valid proof of residence (Aadhaar card).',
          'Candidates must undergo a basic computer aptitude test before final enrollment.'
        ],
        duties: [
          'Undergo 3 months (360 hours) of intensive, free classroom and coding practice.',
          'Learn core full-stack technologies including HTML5, CSS3, JavaScript, React, and Node.js.',
          'Build real-world projects and earn a globally recognized certified training certificate under PSDM.'
        ],
        about: 'The Punjab Skill Development Mission (PSDM) operates this free, certified web training to empower local youths with industry-aligned IT skills.'
      };
    }

    if (title.includes('Freelance Graphic Designer')) {
      return {
        requirements: [
          'Degree or Diploma in Graphic Design, Fine Arts, or equivalent work experience.',
          'Proficiency in Adobe Photoshop, Adobe Illustrator, InDesign, and CorelDRAW.',
          'Must possess a strong portfolio showing past branding or marketing collateral designs.'
        ],
        duties: [
          'Design high-impact digital posters, social media banners, and brochure layouts for PAEC.',
          'Cooperate with export promotion officers to translate regional branding requirements into designs.',
          'Deliver print-ready graphic assets within designated contract deadlines.'
        ],
      };
    }

    if (title.includes('Study Scholarship') || title.includes('Scholarship Scheme')) {
      return {
        requirements: [
          'Must be a permanent resident of Punjab.',
          'Must have secured admission in a post-graduate program at an accredited top-200 global university.',
          'Family income must not exceed ₹8,0,000 per annum.',
          'Must hold a valid passport and fulfill IELTS/TOEFL requirements.'
        ],
        duties: [
          'Utilize up to ₹20,00,000 scholarship funding for tuition fees, study materials, and living expenses.',
          'Adhere to the academic excellence standards of the foreign host university.',
          'Submit bi-annual academic progress reports to the DBEE Oversea Cell for disbursement.'
        ],
        about: 'This Fully-Funded Foreign Study Scholarship Scheme is operated under state directives to enable deserving and underprivileged local talents to access world-class higher education abroad.'
      };
    }
    
    if (title.includes('Agniveer') || title.includes('Army')) {
      return {
        requirements: [
          'Age must be between 17.5 and 21 years on the date of recruitment.',
          'Class 10th (Matriculation) pass with minimum 45% marks in aggregate.',
          'Physical fitness: Height 170cm minimum, Chest 77cm (+5cm expansion).',
          'Must pass the 1.6km run in under 5 mins 30 secs, and complete 10 pull-ups.'
        ],
        duties: [
          'Serve for a duration of 4 years under the Agniveer scheme of the Indian Army.',
          'Undergo rigorous military training and participate in active security and defense operations.',
          'Receive the Seva Nidhi package and get opportunities for permanent absorption in regular cadres.'
        ],
        about: 'The Agniveer Induction Rally is an official recruitment drive conducted by the Indian Army in collaboration with the DBEE to enlist courageous youths into armed defense forces.'
      };
    }

    // Default fallback for any other jobs/schemes
    return {
      requirements: [
        'Relevant degree, diploma, or certificate in the specified field.',
        'Active interest and dedication to the role or venture.',
        'Valid identification proofs (Aadhaar, PAN, or Passport) and educational certificates.',
        'Must satisfy age criteria and submit application before the listed deadline.'
      ],
      duties: [
        'Perform core responsibilities associated with the role or startup venture under guidance.',
        'Adhere to guidelines, standard operating procedures, and professional ethics.',
        'Collaborate with team members, supervisors, and community stakeholders.',
        'Participate in periodic skill development and training sessions provided by the employer.'
      ],
      about: job.description || 'This opportunity is offered under the smart guidance of Path Mitra (PGRKAM), aimed at enabling employment access for all eligible candidates.'
    };
  };

  const fetchJobs = useCallback(async (search, category) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const url = `/jobs${params.toString() ? `?${params}` : ''}`;
      const response = await api.get(url);
      const data = response.data.data || response.data;
      setJobs(Array.isArray(data) ? data : []);
      setTotalJobs(response.data.total || (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Fetch saved jobs
      const savedRes = await api.get('/saved-jobs');
      const savedIds = new Set(savedRes.data.map(j => j._id || j.id));
      setSavedJobIds(savedIds);

      // Fetch applied jobs
      const appliedRes = await api.get('/applications');
      const appliedIds = new Set(appliedRes.data.map(app => app.job?._id || app.job?.id || app.job_id));
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error('Failed to fetch user relationships:', err);
    }
  }, []);

  useEffect(() => {
    fetchJobs(searchParam, categoryParam);
    setSearchInput(searchParam);
    setSelectedCategory(categoryParam);
    fetchUserData();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [searchParam, categoryParam, fetchJobs, fetchUserData]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchInput.trim()) params.set('search', searchInput.trim());
    navigate(`/jobs${params.toString() ? `?${params}` : ''}`);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/jobs${params.toString() ? `?${params}` : ''}`);
  };

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
      console.error('Failed to toggle save status', err);
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
      console.error('Failed to apply for job', err);
      alert(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  const categories = [
    { id: '', label: 'All Listings' },
    { id: 'govt', label: 'Government Jobs' },
    { id: 'private', label: 'Private Sector' },
    { id: 'foreign', label: 'Foreign Placements' },
    { id: 'self-employment', label: 'Self Employment' },
  ];

  const categoryColors = {
    govt: 'bg-saffron/10 text-saffron-dark border-saffron/20 border',
    private: 'bg-green-india/10 text-green-india-dark border-green-india/20 border',
    foreign: 'bg-navy-chakra/5 text-navy-chakra border-navy-chakra/10 border',
    'self-employment': 'bg-green-india/20 text-green-india-dark border-green-india/30 border',
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-navy-chakra tracking-tight mb-2">Explore Employment & Opportunities</h1>
          <p className="text-slate-500 font-medium leading-relaxed font-sans">Discover verified government recruitment drives, private placements, MSME startup avenues, and certified foreign placements.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by role, keyword, department or scheme..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all text-sm font-medium text-navy-chakra"
            />
            {searchInput && (
              <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            )}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:w-56 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-saffron transition-all cursor-pointer text-slate-700 text-sm font-semibold"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 text-white px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-2 text-sm"
          >
            <Search size={18} /> Search Opportunities
          </button>
        </div>

        {/* Active Filters */}
        {(searchParam || categoryParam) && !loading && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-500 font-semibold">
              Showing <span className="font-bold text-navy-chakra">{totalJobs}</span> result{totalJobs !== 1 ? 's' : ''}
              {searchParam && <> for "<span className="text-saffron font-bold">{searchParam}</span>"</>}
              {categoryParam && <> in <span className="text-saffron font-bold capitalize">{categoryParam.replace(/-/g, ' ')}</span></>}
            </span>
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all"
            >
              <X size={12} /> Clear all filters
            </button>
          </div>
        )}

        {/* Category Quick Tabs */}
        <div className="flex gap-2.5 flex-wrap mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const params = new URLSearchParams();
                if (cat.id) params.set('category', cat.id);
                if (searchInput.trim()) params.set('search', searchInput.trim());
                navigate(`/jobs${params.toString() ? `?${params}` : ''}`);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-saffron text-white border-saffron shadow-md shadow-saffron/20'
                  : 'bg-white text-navy-chakra/80 border-slate-200 hover:border-saffron/40 hover:text-saffron shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            <p className="text-slate-500 text-xs font-semibold">Searching opportunities...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 font-medium text-sm">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm max-w-xl mx-auto">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-navy-chakra mb-2">No listings found</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
              {searchParam
                ? `No matched opportunities for "${searchParam}". Please clear your search filters and try again.`
                : 'No opportunities are listed under this category right now.'}
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-2.5 bg-gradient-to-r from-saffron to-saffron-hover text-white rounded-xl font-bold shadow-md shadow-saffron/10 hover:shadow-saffron/20 hover:-translate-y-0.5 transition-all text-xs"
            >
              View All Opportunities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const jobId = job.id || job._id;
              const isSaved = savedJobIds.has(jobId);
              const isApplied = appliedJobIds.has(jobId);

              return (
                <div key={jobId} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div className="flex-1 pr-2">
                        <h3 
                          onClick={() => setSelectedJob(job)}
                          className="font-bold text-base text-navy-chakra mb-1 leading-snug line-clamp-1 hover:text-saffron cursor-pointer transition-colors"
                          title="Click to view details"
                        >
                          {job.title}
                        </h3>
                        <div className="text-saffron font-bold text-xs flex items-center gap-1.5">
                          <Building2 size={13} /> {job.company}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${categoryColors[job.category] || 'bg-slate-100 text-slate-700'}`}>
                          {job.category === 'govt' ? 'GOVT' : job.category === 'self-employment' ? 'SCHEME' : job.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs mb-3 line-clamp-3 leading-relaxed font-medium">{job.description}</p>
                    
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="text-xs text-saffron hover:text-saffron-dark font-extrabold flex items-center gap-1 mb-4 focus:outline-none transition-colors"
                    >
                      <Briefcase size={12} /> View details & requirements
                    </button>
                  </div>

                  <div>
                    <div className="space-y-2 mb-5 border-t border-slate-100 pt-4">
                      <div className="flex items-center text-slate-500 text-xs font-semibold gap-2">
                        <MapPin size={13} className="text-slate-400 shrink-0" /> {job.location}
                      </div>
                      <div className="flex items-center text-slate-500 text-xs font-semibold gap-2">
                        <Briefcase size={13} className="text-slate-400 shrink-0" /> {job.type}
                      </div>
                      {job.salary_range && (
                        <div className="flex items-center text-slate-600 text-xs font-bold gap-2">
                          <IndianRupee size={13} className="text-green-india shrink-0" /> {job.salary_range}
                        </div>
                      )}
                      {job.deadline && (
                        <div className="flex items-center text-slate-500 text-xs font-semibold gap-2">
                          <Clock size={13} className="text-saffron shrink-0" /> Apply by:{' '}
                          {new Date(job.deadline).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>

                    {isAdmin ? (
                      <Link 
                        to="/dashboard?tab=manage_jobs" 
                        className="w-full text-center py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 hover:text-navy-chakra text-navy-chakra/80 border border-slate-200 transition-all text-xs block"
                      >
                        Manage Posting (Admin)
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleSaveToggle(jobId)}
                          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all hover:-translate-y-0.5 ${
                            isSaved 
                              ? 'bg-green-india/10 text-green-india border-green-india/30 hover:bg-green-india/20' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-saffron hover:border-saffron/30 hover:bg-saffron/5'
                          }`}
                          title={isSaved ? "Saved to bookmarks" : "Save to bookmarks"}
                        >
                          <Bookmark size={13} className={isSaved ? "fill-green-india text-green-india" : ""} />
                          {isSaved ? "Saved" : "Save"}
                        </button>

                        <button 
                          onClick={() => handleApply(jobId)}
                          disabled={isApplied}
                          className={`flex-1 py-2.5 rounded-xl font-extrabold transition-all text-xs hover:-translate-y-0.5 flex items-center justify-center gap-1.5 ${
                            isApplied
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : 'bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 text-white'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check size={14} className="text-green-india" /> Applied
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (() => {
        const details = getJobDetails(selectedJob);
        const jobId = selectedJob.id || selectedJob._id;
        const isSaved = savedJobIds.has(jobId);
        const isApplied = appliedJobIds.has(jobId);

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-navy-chakra via-slate-900 to-navy-chakra text-white relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-saffron rounded-full blur-[80px] opacity-10"></div>
                <div className="relative z-10 flex-1 pr-4">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest mb-2 border border-white/20 bg-white/10 text-saffron`}>
                    {selectedJob.category === 'govt' ? 'GOVERNMENT' : selectedJob.category === 'self-employment' ? 'SCHEME' : selectedJob.category.toUpperCase()}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black leading-snug">{selectedJob.title}</h2>
                  <p className="text-slate-300 font-bold text-xs mt-1.5 flex items-center gap-1.5">
                    <Building2 size={13} className="text-saffron" /> {selectedJob.company}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)} 
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors shrink-0 relative z-10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Meta details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</span>
                    <span className="text-xs text-navy-chakra font-bold mt-1 flex items-center gap-1"><MapPin size={12} className="text-saffron shrink-0" /> {selectedJob.location}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Job Type</span>
                    <span className="text-xs text-navy-chakra font-bold mt-1 flex items-center gap-1"><Briefcase size={12} className="text-saffron shrink-0" /> {selectedJob.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary / Support</span>
                    <span className="text-xs text-navy-chakra font-bold mt-1 flex items-center gap-1"><IndianRupee size={12} className="text-green-india shrink-0" /> {selectedJob.salary_range || 'Varies'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Apply Before</span>
                    <span className="text-xs text-navy-chakra font-bold mt-1 flex items-center gap-1"><Clock size={12} className="text-saffron shrink-0" /> {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Open'}</span>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h3 className="text-xs font-extrabold text-navy-chakra uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">About the Opportunity</h3>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">{details.about}</p>
                </div>

                {/* Requirements / Eligibility Section */}
                <div>
                  <h3 className="text-xs font-extrabold text-navy-chakra uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Eligibility & Requirements</h3>
                  <ul className="space-y-2.5">
                    {details.requirements.map((req, idx) => (
                      <li key={idx} className="text-xs text-slate-600 font-medium leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron mt-1.5 shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Duties / Benefits Section */}
                <div>
                  <h3 className="text-xs font-extrabold text-navy-chakra uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Key Duties & Benefits</h3>
                  <ul className="space-y-2.5">
                    {details.duties.map((duty, idx) => (
                      <li key={idx} className="text-xs text-slate-600 font-medium leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-india mt-1.5 shrink-0"></span>
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                {isAdmin ? (
                  <Link 
                    to="/dashboard?tab=manage_jobs" 
                    className="px-8 py-3 rounded-xl font-extrabold bg-slate-100 hover:bg-slate-200 hover:text-navy-chakra text-navy-chakra/80 border border-slate-200 transition-all text-xs block"
                  >
                    Manage Posting in Dashboard (Admin View)
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSaveToggle(jobId)}
                      className={`flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border text-xs font-extrabold transition-all hover:-translate-y-0.5 ${
                        isSaved 
                          ? 'bg-green-india/10 text-green-india border-green-india/30 hover:bg-green-india/20' 
                          : 'bg-white text-slate-700 border-slate-200 hover:text-saffron hover:border-saffron/30'
                      }`}
                    >
                      <Bookmark size={14} className={isSaved ? "fill-green-india text-green-india" : ""} />
                      {isSaved ? "Saved" : "Save to Bookmarks"}
                    </button>

                    <button 
                      onClick={() => {
                        handleApply(jobId);
                      }}
                      disabled={isApplied}
                      className={`px-8 py-3 rounded-xl font-extrabold transition-all text-xs hover:-translate-y-0.5 flex items-center justify-center gap-1.5 ${
                        isApplied
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 text-white'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check size={14} className="text-green-india" /> Applied
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Jobs;
