import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { register } from '@/api/user.api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    // Show CAPTCHA box
    setShowCaptcha(true);
  };

  const handleCaptchaClick = () => {
    setLoadingVerify(true);
    setTimeout(() => {
      setCaptchaVerified(true);
      setLoadingVerify(false);
      setShowCaptcha(false);
      continueSignup();
    }, 2000);
  };

  const continueSignup = async () => {
    try {
      const response = await register(username, email, password);

      if (response.success) {
        toast.success(response.message);
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
      setError('Signup failed. Please check your details and try again.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-purple-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign Up
                </Button>
              </div>
            </form>
            <p className='mt-2 cursor-pointer hover:text-blue-800' onClick={() => navigate('/login')}>
              Already have an account? Log in
            </p>
          </div>
        </div>
      </div>

      {/* Fake CAPTCHA Box */}
      {showCaptcha && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Security Check</h2>
            <p className="text-sm text-gray-600 mb-4">To continue, please verify you're not a robot.</p>

            <div
              className={`flex items-center justify-start border-2 border-gray-300 rounded px-4 py-2 cursor-pointer hover:shadow-md transition duration-300 ${
                loadingVerify ? 'opacity-60 pointer-events-none' : ''
              }`}
              onClick={handleCaptchaClick}
            >
              <div className="w-5 h-5 border-2 border-gray-500 rounded-sm flex items-center justify-center mr-3">
                {loadingVerify ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-gray-700">I'm not a robot</span>
            </div>

            <p className="text-xs mt-2 text-gray-500">This site requires verification to continue.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
