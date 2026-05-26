import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const VerifyEmail = () => {
  const { id, hash } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verify = async () => {
      try {
        // Construct the full URL with query parameters from the signed route
        const query = searchParams.toString();
        const response = await api.get(`/email/verify/${id}/${hash}?${query}`);
        
        setStatus('success');
        setMessage(response.data.message || 'Email successfully verified!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or expired.');
      }
    };

    if (id && hash) {
      verify();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [id, hash, searchParams, navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-india/5 rounded-full blur-[100px]"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-saffron animate-spin mb-4" />
              <h2 className="text-2xl font-black text-navy-chakra">Verifying Email</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-india mb-4" />
              <h2 className="text-2xl font-black text-navy-chakra">Email Verified!</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">{message}</p>
              <p className="text-xs text-slate-400 mt-4 animate-pulse">Redirecting to login...</p>
              <Link to="/login" className="mt-6 inline-block bg-gradient-to-r from-saffron to-saffron-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-saffron/10 hover:shadow-saffron/20 hover:-translate-y-0.5 transition-all text-sm">
                Go to Login Now
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-black text-navy-chakra">Verification Failed</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">{message}</p>
              <Link to="/login" className="mt-6 inline-block bg-gradient-to-r from-saffron to-saffron-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-saffron/10 hover:shadow-saffron/20 hover:-translate-y-0.5 transition-all text-sm">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
