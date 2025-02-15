import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onSuccess: () => void;
}

// Valid test credentials
const VALID_CREDENTIALS = {
  email: 'test@neural.ai',
  password: 'neural123'
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (email.length < 5 || !email.includes('@')) {
        throw new Error('Invalid neural identifier format');
      }
      if (password.length < 6) {
        throw new Error('Access key must be at least 6 characters');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials
      if (email !== VALID_CREDENTIALS.email || password !== VALID_CREDENTIALS.password) {
        throw new Error('Neural authentication failed: Invalid credentials');
      }

      localStorage.setItem('user', JSON.stringify({ 
        email, 
        name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}` 
      }));
      
      toast({
        title: "Neural interface connected",
        description: "Synchronizing with task matrix...",
      });

      // Force a full page reload after successful login
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neural interface connection failed');
      toast({
        title: "Connection failed",
        description: err instanceof Error ? err.message : 'Neural interface error',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-black/40 border-gray-800 backdrop-blur-sm w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Neural Interface Login
          </h2>
          <p className="text-gray-400 text-center text-sm">
            Access your neural matrix dashboard
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Neural ID (Email)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className={`bg-gray-900/60 border-gray-700 text-gray-100 placeholder:text-gray-500
                ${error && 'border-red-500 focus:ring-red-500'}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Access Key"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className={`bg-gray-900/60 border-gray-700 text-gray-100 placeholder:text-gray-500
                ${error && 'border-red-500 focus:ring-red-500'}`}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full ${error 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-cyan-500 hover:bg-cyan-600'} text-black`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Initialize Connection
            </>
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          <p>Test credentials:</p>
          <p className="text-gray-400">Neural ID: test@neural.ai</p>
          <p className="text-gray-400">Access Key: neural123</p>
        </div>
      </form>
    </Card>
  );
}