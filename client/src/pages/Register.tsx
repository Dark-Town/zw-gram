import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { register } from '@/api/user.api';
import ReCAPTCHA from 'react-google-recaptcha';

 const Register: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }

    try {
      const response = await register(form.username, form.email, form.password, captchaToken);
      if (response.success) {
        toast.success(response.message);
        navigate('/login');
      } else {
        setError(response.message || 'Signup failed.');
      }
    } catch {
      setError('Signup failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-purple-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <Input name="username" value={form.username} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} required />
              </div>

              <ReCAPTCHA
                sitekey="6LfhUUgrAAAAAAf5vnoDrSVptF5CMi1MDP5wnD6O"
                onChange={handleCaptcha}
              />

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>
              Already have an account? Log in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
