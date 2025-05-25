import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import { register } from '@/api/user.api';

  const cards = ['♠️', '♣️', '♥️', '♦️'];

  const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGame, setShowGame] = useState(false);
  const [matched, setMatched] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<string[]>([]);
  const navigate = useNavigate();

    const shuffleCards = () => {
    const deck = [...cards, '♠️']; // Add 2 spades for easier match
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setShuffledCards(deck);
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setShowGame(true);
    shuffleCards();
  };

  const handleCardClick = async (card: string) => {
    if (card === '♠️') {
      setMatched(true);
      setTimeout(async () => {
        const response = await register(username, email, password);
        if (response.success) {
          toast.success('Verified & registered!');
          navigate('/login');
        } else {
          setError(response.message || 'Registration failed.');
        }
      }, 1000);
    } else {
      toast.error('Try again!');
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
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
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
            <p
              className="mt-4 text-sm text-center text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Already have an account? Log in
            </p>
          </div>
        </div>
      </div>

      {/* Game Modal */}
      {showGame && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-[340px]">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Verify: Click a ♠️ card</h3>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {shuffledCards.map((card, i) => (
                <div
                  key={i}
                  onClick={() => handleCardClick(card)}
                  className="w-16 h-20 border border-gray-300 rounded-md flex items-center justify-center text-2xl bg-purple-100 hover:bg-purple-200 cursor-pointer"
                >
                  {card}
                </div>
              ))}
            </div>
            <p className="text-xs mt-4 text-gray-500">This site uses fun verification instead of CAPTCHA.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
