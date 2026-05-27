import { useState, useEffect } from 'react';
import { User, FileText, Bookmark, Bell, Settings, LogOut, Briefcase, Users, LayoutDashboard, Database, Activity, Trash2, X, Plus, Edit, Check, MapPin, IndianRupee, Building2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [user, setUser] = useState(null);
  const [jobsList, setJobsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loadingData, setLoadingData] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time', category: 'private', salary_range: '', deadline: '', description: ''
  });
  const [dashboardStats, setDashboardStats] = useState({ stats: {}, recentActivity: [] });
  const [loadingStats, setLoadingStats] = useState(false);
  const [resumeData, setResumeData] = useState({
    name: '', title: '', email: '', phone: '', location: '', summary: '', company: '', duration: '', experienceDetails: '', education: '', eduYear: '', skills: ''
  });

  const navigate = useNavigate();

  const [settingsForm, setSettingsForm] = useState({
    name: '',
    phone_number: '',
    location: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.phone_verified_at && parsedUser.role !== 'admin') {
        navigate('/onboarding');
      } else {
        setUser(parsedUser);
        setSettingsForm({
          name: parsedUser.name || '',
          phone_number: parsedUser.phone_number || '',
          location: parsedUser.location || ''
        });
        setResumeData(prev => ({
          ...prev,
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone_number || '',
          location: parsedUser.location || ''
        }));
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const getProfileCompleteness = () => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score += 25;
    if (user.email) score += 25;
    if (user.phone_number) score += 25;
    if (user.location) score += 25;
    return score;
  };
  const completeness = getProfileCompleteness();

  useEffect(() => {
    if (activeTab === 'overview' && user) {
      fetchStats();
    }
    if (user && user.role !== 'admin') {
      if (activeTab === 'applications') fetchApplications();
      if (activeTab === 'saved') {
        fetchSavedJobs();
        fetchApplicationsSilently();
      }
    }
    if (user?.role === 'admin') {
      if (activeTab === 'manage_jobs') fetchJobs();
      if (activeTab === 'manage_users') fetchUsers();
    }
  }, [activeTab, user]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const endpoint = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
      const response = await api.get(endpoint);
      setDashboardStats(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingData(true);
    try {
      const response = await api.get('/jobs');
      setJobsList(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingData(true);
    try {
      const response = await api.get('/users');
      setUsersList(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingData(true);
    try {
      const response = await api.get('/applications');
      setApplicationsList(response.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchSavedJobs = async () => {
    setLoadingData(true);
    try {
      const response = await api.get('/saved-jobs');
      setSavedJobsList(response.data);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchApplicationsSilently = async () => {
    try {
      const response = await api.get('/applications');
      const appliedIds = new Set(response.data.map(app => app.job?._id || app.job?.id || app.job_id));
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error('Failed to silently fetch applications:', err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Applied successfully! You can track status under the Applications tab.');
      setAppliedJobIds(prev => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });
      fetchStats();
      fetchApplicationsSilently();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/unsave`);
      setSavedJobsList(prev => prev.filter(job => (job.id || job._id || job.job_id) !== jobId));
      fetchStats();
    } catch (err) {
      alert('Failed to remove bookmark.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, jobFormData);
      } else {
        await api.post('/jobs', jobFormData);
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
      setJobFormData({ title: '', company: '', location: '', type: 'Full-time', category: 'private', salary_range: '', deadline: '', description: '' });
      fetchJobs();
    } catch (err) {
      alert('Failed to save job');
    }
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      salary_range: job.salary_range || '',
      deadline: job.deadline || '',
      description: job.description
    });
    setIsJobModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = {
      ...user,
      name: settingsForm.name,
      phone_number: settingsForm.phone_number,
      location: settingsForm.location
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update resume data so resume builder syncs as well
    setResumeData(prev => ({
      ...prev,
      name: settingsForm.name,
      phone: settingsForm.phone_number,
      location: settingsForm.location
    }));
    
    alert('Profile updated successfully!');
  };

  const handlePrintResume = () => {
    window.print();
  };

  const isAdmin = user?.role === 'admin';

  const userNav = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'applications', label: 'Applications', icon: <FileText size={18} /> },
    { id: 'saved', label: 'Saved Jobs', icon: <Bookmark size={18} /> },
    { id: 'resume', label: 'Resume Builder', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const adminNav = [
    { id: 'overview', label: 'System Overview', icon: <Activity size={18} /> },
    { id: 'manage_jobs', label: 'Manage Jobs', icon: <Database size={18} /> },
    { id: 'manage_users', label: 'Manage Users', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const userStats = [
    { label: 'Applied Jobs', value: dashboardStats.stats['Applied Jobs'] || '0', icon: <Briefcase className="text-saffron" /> },
    { label: 'Saved Jobs', value: dashboardStats.stats['Saved Jobs'] || '0', icon: <Bookmark className="text-green-india" /> },
    { label: 'Profile Views', value: dashboardStats.stats['Profile Views'] || '0', icon: <User className="text-navy-chakra" /> },
    { label: 'Interviews', value: dashboardStats.stats['Interviews'] || '0', icon: <Bell className="text-chakra" /> },
  ];

  const adminStats = [
    { label: 'Total Users', value: dashboardStats.stats['Total Users'] || '0', icon: <Users className="text-navy-chakra" /> },
    { label: 'Active Jobs', value: dashboardStats.stats['Active Jobs'] || '0', icon: <Database className="text-green-india" /> },
    { label: 'New Applications', value: dashboardStats.stats['New Applications'] || '0', icon: <FileText className="text-saffron" /> },
    { label: 'System Alerts', value: dashboardStats.stats['System Alerts'] || '0', icon: <Bell className="text-chakra" /> },
  ];

  const activeNav = isAdmin ? adminNav : userNav;
  const activeStats = isAdmin ? adminStats : userStats;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col shrink-0">
        <div className="p-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-saffron to-green-india rounded-full flex items-center justify-center text-white font-extrabold text-2xl mb-4 uppercase shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="text-lg font-bold text-navy-chakra">{user?.name || 'User'}</h2>
          <p className="text-sm font-medium">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1.5 ${isAdmin ? 'bg-navy-chakra text-white shadow-sm' : 'bg-saffron-light text-saffron-dark'}`}>
              {isAdmin ? 'System Administrator' : 'Job Seeker'}
            </span>
          </p>
          
          {!isAdmin && (
            <>
              <div className="mt-5 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-saffron to-green-india h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-2">Profile {completeness}% complete</p>
            </>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {activeNav.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-saffron-light text-saffron-dark shadow-sm border border-saffron/10' 
                  : 'text-navy-chakra/70 hover:bg-slate-50 hover:text-navy-chakra'
              }`}
            >
              {item.icon} {
                item.id === 'manage_jobs' ? t('dashboard.tabs.manageJobs') :
                item.id === 'manage_users' ? t('dashboard.tabs.manageUsers') :
                t(`dashboard.tabs.${item.id}`)
              }
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-sm font-bold transition-all"
          >
            <LogOut size={18} /> {t('navbar.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-sans">
            {isAdmin ? (
              activeTab === 'overview' ? t('dashboard.tabs.systemOverview') :
              activeTab === 'manage_jobs' ? t('dashboard.tabs.manageJobs') :
              activeTab === 'manage_users' ? t('dashboard.tabs.manageUsers') : t('dashboard.tabs.settings')
            ) : (
              activeTab === 'overview' ? t('dashboard.tabs.overview') :
              activeTab === 'applications' ? t('dashboard.tabs.applications') :
              activeTab === 'saved' ? t('dashboard.tabs.saved') : t('dashboard.tabs.settings')
            )}
          </h1>
          {isAdmin && activeTab === 'manage_jobs' && (
            <button 
              onClick={() => { setEditingJob(null); setJobFormData({ title: '', company: '', location: '', type: 'Full-time', category: 'private', salary_range: '', deadline: '', description: '' }); setIsJobModalOpen(true); }}
              className="bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 text-white px-4 py-2.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus size={18} /> Add New Job
            </button>
          )}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {activeStats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-saffron/20 transition-all duration-300">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{stat.label}</p>
                    <p className="text-3xl font-black text-navy-chakra">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-lg">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-navy-chakra">
                  {isAdmin ? 'Recent System Activity' : 'Recent Applications'}
                </h2>
                <button onClick={() => setActiveTab(isAdmin ? 'manage_jobs' : 'applications')} className="text-saffron hover:text-saffron-dark text-sm font-bold hover:underline">
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="pb-3 font-medium">{isAdmin ? 'Action' : 'Job Role'}</th>
                      <th className="pb-3 font-medium">{isAdmin ? 'User/Entity' : 'Company'}</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAdmin ? (
                      loadingStats ? (
                        <tr><td colSpan="4" className="py-4 text-center text-slate-500">Loading...</td></tr>
                      ) : dashboardStats.recentActivity.length === 0 ? (
                        <tr><td colSpan="4" className="py-4 text-center text-slate-500">No recent activity</td></tr>
                      ) : (
                        dashboardStats.recentActivity.map((job, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                            <td className="py-4 font-medium text-slate-900">{job.role}</td>
                            <td className="py-4 text-slate-600">{job.company}</td>
                            <td className="py-4 text-slate-600">{job.date}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${job.color}-50 text-${job.color}-700 border border-${job.color}-200`}>
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )
                    ) : (
                      loadingStats ? (
                        <tr><td colSpan="4" className="py-4 text-center text-slate-500">Loading...</td></tr>
                      ) : dashboardStats.recentActivity.length === 0 ? (
                        <tr><td colSpan="4" className="py-4 text-center text-slate-500">No recent applications</td></tr>
                      ) : (
                        dashboardStats.recentActivity.map((job, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                            <td className="py-4 font-medium text-slate-900">{job.role}</td>
                            <td className="py-4 text-slate-600">{job.company}</td>
                            <td className="py-4 text-slate-600">{job.date}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${job.color}-50 text-${job.color}-700 border border-${job.color}-200`}>
                                {job.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'manage_jobs' && isAdmin && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Title & Company</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Salary</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingData ? (
                    <tr><td colSpan="5" className="text-center py-8">Loading jobs...</td></tr>
                  ) : jobsList.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 text-slate-500">No jobs found.</td></tr>
                  ) : (
                    jobsList.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{job.title}</div>
                          <div className="text-xs text-slate-500">{job.company}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            job.category === 'govt' ? 'bg-saffron/10 text-saffron' : 
                            job.category === 'private' ? 'bg-green-india/10 text-green-india' : 
                            'bg-navy-chakra/10 text-navy-chakra'
                          }`}>
                            {job.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{job.location}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{job.salary_range || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditJob(job)} className="p-2 text-saffron hover:bg-saffron-light rounded-lg transition-colors" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'manage_users' && isAdmin && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Name & Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Verified</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingData ? (
                    <tr><td colSpan="5" className="text-center py-8">Loading users...</td></tr>
                  ) : usersList.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 text-slate-500">No users found.</td></tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-navy-chakra text-white shadow-sm' : 'bg-saffron-light text-saffron-dark'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{u.phone_number || 'N/A'}</td>
                        <td className="px-6 py-4">
                          {u.phone_verified_at ? (
                            <span className="text-emerald-600 flex items-center gap-1 text-xs font-medium">
                              <Check size={14} /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <button 
                              onClick={() => handleDeleteUser(u.id)} 
                              disabled={u.role === 'admin'}
                              className={`p-2 rounded-lg transition-colors ${u.role === 'admin' ? 'text-slate-200 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                              title={u.role === 'admin' ? 'Cannot delete admin' : 'Delete User'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && !isAdmin && (
          loadingData ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron mx-auto"></div></div>
          ) : applicationsList.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center max-w-xl mx-auto">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-navy-chakra mb-2">No applications yet</h3>
              <p className="text-slate-500 mb-6 font-medium text-sm leading-relaxed">You haven't applied to any opportunities yet. Explore private jobs, government jobs, and other avenues to get started!</p>
              <Link to="/jobs" className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 transition-all hover:-translate-y-0.5">
                Explore Jobs
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Opportunity Role</th>
                      <th className="px-6 py-4">Organization</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applicationsList.map((app) => {
                      const statusColor = app.status === 'accepted' ? 'bg-green-india/10 text-green-india-dark' : 'bg-saffron/10 text-saffron-dark';
                      return (
                        <tr key={app.id || app._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-navy-chakra">{app.job?.title || 'PGRKAM Venture'}</td>
                          <td className="px-6 py-4 text-slate-600 font-semibold text-sm">{app.job?.company || 'Employment Cell'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{app.job?.location || 'Remote / Punjab'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${statusColor}`}>
                              {app.status || 'applied'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {activeTab === 'saved' && !isAdmin && (
          loadingData ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron mx-auto"></div></div>
          ) : savedJobsList.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center max-w-xl mx-auto">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-navy-chakra mb-2">No bookmarked items</h3>
              <p className="text-slate-500 mb-6 font-medium text-sm leading-relaxed">You haven't saved any career opportunities or schemes yet. Bookmark listings to view them later.</p>
              <Link to="/jobs" className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 transition-all hover:-translate-y-0.5">
                Explore Jobs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobsList.map((job) => {
                const jobId = job._id || job.id;
                const isApplied = appliedJobIds.has(jobId);

                return (
                  <div key={jobId} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-base text-navy-chakra leading-snug line-clamp-1">{job.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          job.category === 'govt' ? 'bg-saffron/10 text-saffron' : 
                          job.category === 'private' ? 'bg-green-india/10 text-green-india' : 
                          'bg-navy-chakra/10 text-navy-chakra'
                        }`}>
                          {job.category}
                        </span>
                      </div>
                      <div className="text-saffron font-bold text-xs flex items-center gap-1.5 mb-3">
                        <Building2 size={13} /> {job.company}
                      </div>
                      <p className="text-slate-500 text-xs mb-5 line-clamp-2 leading-relaxed font-medium">{job.description}</p>
                    </div>
                    <div>
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-slate-500 text-xs font-semibold gap-2">
                          <MapPin size={13} className="text-slate-400 shrink-0" /> {job.location}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center text-slate-600 text-xs font-bold gap-2">
                            <IndianRupee size={13} className="text-green-india shrink-0" /> {job.salary_range}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUnsave(jobId)}
                          className="flex items-center justify-center p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 size={14} />
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
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'resume' && !isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Inputs Panel */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-chakra">Smart ATS Resume Builder</h2>
                <p className="text-slate-500 text-xs mt-0.5">Generate a professional, recruiter-ready resume in real-time.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-extrabold text-saffron uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">1. Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={resumeData.name} 
                        onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Job Title</label>
                      <input 
                        type="text" 
                        value={resumeData.title} 
                        onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        value={resumeData.email} 
                        onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Phone</label>
                      <input 
                        type="tel" 
                        value={resumeData.phone} 
                        onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Location</label>
                      <input 
                        type="text" 
                        value={resumeData.location} 
                        onChange={(e) => setResumeData({...resumeData, location: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="Chandigarh, Punjab"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-saffron uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">2. Professional Summary</h3>
                  <textarea 
                    rows="3"
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                    placeholder="Brief overview of your experience, key achievements, and career goals..."
                  />
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-saffron uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">3. Work Experience</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Company</label>
                        <input 
                          type="text" 
                          value={resumeData.company} 
                          onChange={(e) => setResumeData({...resumeData, company: e.target.value})}
                          className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                          placeholder="Tech Corp Ltd"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Role Duration</label>
                        <input 
                          type="text" 
                          value={resumeData.duration} 
                          onChange={(e) => setResumeData({...resumeData, duration: e.target.value})}
                          className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                          placeholder="2024 - Present"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Key Responsibilities & Achievements</label>
                      <textarea 
                        rows="3"
                        value={resumeData.experienceDetails}
                        onChange={(e) => setResumeData({...resumeData, experienceDetails: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="Developed web interfaces, managed local inventory logistics, reduced processing times by 20%..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-saffron uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">4. Education</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Degree & School</label>
                      <input 
                        type="text" 
                        value={resumeData.education} 
                        onChange={(e) => setResumeData({...resumeData, education: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="B.Tech in Computer Science, Punjab University"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Passing Year</label>
                      <input 
                        type="text" 
                        value={resumeData.eduYear} 
                        onChange={(e) => setResumeData({...resumeData, eduYear: e.target.value})}
                        className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                        placeholder="2025"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-saffron uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">5. Professional Skills</h3>
                  <input 
                    type="text" 
                    value={resumeData.skills} 
                    onChange={(e) => setResumeData({...resumeData, skills: e.target.value})}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all"
                    placeholder="React, JavaScript, Project Management, Customer Service (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Resume Preview & Actions Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-between sm:flex-row gap-4">
                <div>
                  <h3 className="font-bold text-navy-chakra text-sm">Resume Preview</h3>
                  <p className="text-slate-500 text-xs font-medium">This is how your final resume will look when saved.</p>
                </div>
                <button
                  onClick={handlePrintResume}
                  className="px-6 py-2.5 bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-lg hover:shadow-saffron/20 text-white rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-1.5"
                >
                  <FileText size={14} /> Print / Save as PDF
                </button>
              </div>

              {/* Printable Resume Container */}
              <div 
                id="resume-printable-area" 
                className="bg-white p-8 shadow-md border border-slate-200 rounded-3xl text-slate-800 font-serif leading-relaxed max-w-2xl mx-auto"
              >
                {/* Print styling overrides */}
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    #resume-printable-area, #resume-printable-area * {
                      visibility: visible;
                    }
                    #resume-printable-area {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      border: none !important;
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                  }
                `}</style>
                
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
                  <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-900 uppercase">{resumeData.name || 'Your Full Name'}</h1>
                  <p className="text-xs font-sans font-bold text-slate-600 tracking-wider mt-0.5 uppercase">{resumeData.title || 'Desired Profession / Target Role'}</p>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-sans text-slate-500 mt-2">
                    {resumeData.email && <span>📧 {resumeData.email}</span>}
                    {resumeData.phone && <span>📞 {resumeData.phone}</span>}
                    {resumeData.location && <span>📍 {resumeData.location}</span>}
                  </div>
                </div>

                {/* Summary */}
                {resumeData.summary && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold font-sans text-slate-900 border-b border-slate-300 uppercase tracking-wider pb-0.5 mb-1.5">Professional Summary</h2>
                    <p className="text-[11px] leading-relaxed text-slate-700">{resumeData.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.company && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold font-sans text-slate-900 border-b border-slate-300 uppercase tracking-wider pb-0.5 mb-1.5">Professional Experience</h2>
                    <div className="mb-2">
                      <div className="flex justify-between items-baseline text-[11px] font-bold text-slate-900">
                        <span>{resumeData.title || 'Role'} at {resumeData.company}</span>
                        <span className="font-normal font-sans text-slate-500 text-[10px]">{resumeData.duration}</span>
                      </div>
                      {resumeData.experienceDetails && (
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-700 space-y-1">
                          {resumeData.experienceDetails.split('\n').map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeData.education && (
                  <div className="mb-4">
                    <h2 className="text-xs font-bold font-sans text-slate-900 border-b border-slate-300 uppercase tracking-wider pb-0.5 mb-1.5">Education</h2>
                    <div className="flex justify-between items-baseline text-[11px] font-bold text-slate-900">
                      <span>{resumeData.education}</span>
                      <span className="font-normal font-sans text-slate-500 text-[10px]">{resumeData.eduYear}</span>
                    </div>
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills && (
                  <div>
                    <h2 className="text-xs font-bold font-sans text-slate-900 border-b border-slate-300 uppercase tracking-wider pb-0.5 mb-1.5">Technical & Professional Skills</h2>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
                      {resumeData.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] font-sans px-2.5 py-0.5 rounded-full font-semibold border border-slate-200">{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-3xl">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-sm text-slate-500">Update your account details and password.</p>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={handleSaveSettings}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={settingsForm.name} 
                    onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all bg-slate-50" disabled />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={settingsForm.phone_number} 
                    onChange={(e) => setSettingsForm({...settingsForm, phone_number: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={settingsForm.location} 
                    onChange={(e) => setSettingsForm({...settingsForm, location: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all" 
                  />
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-md font-bold text-navy-chakra mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron transition-all" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold transition-all shadow-md text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/20 hover:-translate-y-0.5">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{editingJob ? 'Edit Job Posting' : 'Create New Job'}</h2>
              <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleJobSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <input required value={jobFormData.title} onChange={e => setJobFormData({...jobFormData, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input required value={jobFormData.company} onChange={e => setJobFormData({...jobFormData, company: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input required value={jobFormData.location} onChange={e => setJobFormData({...jobFormData, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={jobFormData.category} onChange={e => setJobFormData({...jobFormData, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none">
                    <option value="private">Private</option>
                    <option value="govt">Government</option>
                    <option value="foreign">Foreign</option>
                    <option value="self-employment">Self Employment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <input value={jobFormData.type} onChange={e => setJobFormData({...jobFormData, type: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                  <input value={jobFormData.salary_range} onChange={e => setJobFormData({...jobFormData, salary_range: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                  <input type="date" value={jobFormData.deadline} onChange={e => setJobFormData({...jobFormData, deadline: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea required rows="4" value={jobFormData.description} onChange={e => setJobFormData({...jobFormData, description: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsJobModalOpen(false)} className="px-6 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-saffron to-saffron-hover text-white rounded-xl font-bold hover:shadow-lg hover:shadow-saffron/20 transition-all hover:-translate-y-0.5">
                  {editingJob ? 'Update Job Posting' : 'Create Job Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;

