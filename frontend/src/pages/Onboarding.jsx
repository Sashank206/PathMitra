import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone_number: '',
    location: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.phone_verified_at) {
        navigate('/dashboard'); // Already verified
      }
      setUser(parsed);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/onboarding/send-otp', formData);
      // Show OTP mock in console for testing
      console.log('OTP is:', response.data.mock_otp);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/onboarding/verify-otp', { otp });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setStep(3);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-india/5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-navy-chakra">
            {step === 1 ? 'Complete Profile' : step === 2 ? 'Verify Identity' : 'All Set!'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {step === 1 ? 'Help us match you to the right employment schemes.' : 
             step === 2 ? `Enter the 6-digit code sent to ${formData.phone_number}` : 
             'Your profile verification was successful.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100 sm:px-10">
          
          {/* Step Progress */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className={`h-2 w-16 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-saffron' : 'bg-slate-200'}`}></div>
            <div className={`h-2 w-16 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-saffron' : 'bg-slate-200'}`}></div>
            <div className={`h-2 w-16 rounded-full transition-all duration-300 ${step === 3 ? 'bg-green-india' : 'bg-slate-200'}`}></div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-sm font-medium"
                    placeholder="e.g. Ludhiana, Punjab"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.phone_number || !formData.location}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-saffron/10 text-sm font-bold text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron transition-all hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP'} <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">Enter 6-digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full px-4 py-4 text-center tracking-[0.5em] text-2xl border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent transition-all outline-none text-navy-chakra font-black"
                  placeholder="------"
                />
                <p className="text-xs text-center text-slate-400 font-semibold mt-3">
                  (Hint for testing: use <span className="text-saffron">123456</span>)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-saffron/10 text-sm font-bold text-white bg-gradient-to-r from-saffron to-saffron-hover hover:shadow-saffron/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Setup Account'}
              </button>
              
              <div className="text-center mt-4">
                <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:text-saffron">
                  Go Back
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-india/10 text-green-india mb-6 animate-bounce">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-navy-chakra mb-2">Verification Success</h3>
              <p className="text-slate-500 text-sm font-semibold mb-6">Securing your Path Mitra profile dashboard...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-india mx-auto"></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
