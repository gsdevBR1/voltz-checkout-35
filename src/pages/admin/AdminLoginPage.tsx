
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login - in a real app this would validate with a backend
    setTimeout(() => {
      // This is just for demo purposes - in a real app, you'd validate credentials
      // against a backend before setting auth state
      if (email === 'admin@voltz.checkout' && password === 'admin') {
        localStorage.setItem('is_admin', 'true');
        toast({
          title: 'Login realizado',
          description: 'Bem-vindo ao painel de administração.',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Erro de autenticação',
          description: 'Credenciais inválidas. Por favor, tente novamente.',
          variant: 'destructive'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
      <Card className="w-[400px] bg-[#1E1E1E] border-white/5 shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-[#10B981]" />
          </div>
          <CardTitle className="text-2xl text-center text-white font-bold">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Acesso restrito para administradores da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  id="email"
                  placeholder="admin@voltz.checkout"
                  required
                  type="email"
                  className="bg-[#262626] border-white/5 focus:border-[#10B981]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Senha
                  </label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-[#262626] border-white/5 focus:border-[#10B981]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                className="w-full bg-[#10B981] hover:bg-[#0e9d6e]" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Autenticando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-xs text-gray-500 w-full mt-2">
            Esta área é exclusiva para administradores da plataforma.
            <br />
            Acessos são monitorados e registrados.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
