import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { register } from '@/api/user.api';

const emojiPairs = ['🎉', '🎉', '🔥', '🔥', '⚡', '⚡'];

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const navigate = useNavigate();

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    // Launch card match verification
    setCards(shuffleArray(emojiPairs));
    setFlipped([]);
    setMatched([]);
    setShowCaptcha(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
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
    } catch (err) {
      toast.error('Signup failed. Please try again.');
      setError('Signup failed. Please check your details.');
    }
  };

  if (matched.length === cards.length && showCaptcha) {
    setShowCaptcha(false);
    continueSignup();
  }

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

      {/* Card Match Captcha Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-[350px]">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Match the Cards</h3>
            <p className="text-sm mb-4 text-gray-600">Tap to match all pairs to verify you're human.</p>
            <div className="grid grid-cols-3 gap-3 justify-items-center">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className="w-16 h-16 border rounded-lg flex items-center justify-center text-2xl bg-gray-100 hover:bg-gray-200"
                >
                  {flipped.includes(index) || matched.includes(index) ? card : '❓'}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">This prevents spam signups.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
