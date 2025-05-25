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
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    setShowCaptcha(true); // Show fake captcha
  };

  const handleCaptchaVerify = () => {
    setIsVerifying(true);
    setTimeout(async () => {
      setShowCaptcha(false);
      setIsVerifying(false);
      await continueSignup();
    }, 2000);
  };

  const continueSignup = async () => {
    try {
      const response = await register(username, email, password);
      if (response.success) {
        toast.success(response.message || 'Registered successfully!');
        navigate('/login');
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (error: any) {
      toast.error('Signup failed. Please try again.');
      setError('Signup failed. Please check your details.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-purple-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <Input type="text" name="username" value={username} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" name="email" value={email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Input type="password" name="password" value={password} onChange={handleChange} required />
              </div>
              <div>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </form>
            <p className="mt-4 text-sm text-center text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
              Already have an account? Log in
            </p>
          </div>
        </div>
      </div>

      {/* Fake Captcha Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[320px] text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">Security Check</p>
            {!isVerifying ? (
              <div
                onClick={handleCaptchaVerify}
                className="flex items-center justify-center gap-3 border rounded-md py-2 px-4 cursor-pointer hover:shadow-lg transition"
              >
                <div className="w-5 h-5 border-2 border-gray-500 rounded-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                </div>
                <span className="text-sm text-gray-700">I'm not a robot</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-600">Verifying...</p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">By verifying, you allow this site to register your account.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
