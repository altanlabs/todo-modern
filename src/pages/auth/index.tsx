import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/blocks/auth/LoginForm';
import { RegisterForm } from '@/components/blocks/auth/RegisterForm';
import { Cpu } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <Cpu className="w-12 h-12 text-cyan-400" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          Neural Task Matrix
        </h1>
      </div>

      {isLogin ? (
        <LoginForm onSuccess={handleSuccess} />
      ) : (
        <RegisterForm 
          onSuccess={handleSuccess}
          onLoginClick={() => setIsLogin(true)}
        />
      )}

      {isLogin && (
        <button
          onClick={() => setIsLogin(false)}
          className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
        >
          Initialize new neural profile
        </button>
      )}
    </div>
  );
}