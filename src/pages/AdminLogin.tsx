import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/58157bac-8508-4720-85a0-89bae9d297a6';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_username', data.username);
        navigate('/admin');
      } else {
        setError(data.error || 'Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-primary/30">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Админ панель</CardTitle>
          <CardDescription className="text-lg">Lirider.fun</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg">Логин</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="text-lg"
              />
            </div>
            {error && (
              <div className="bg-destructive/20 text-destructive p-3 rounded border-2 border-destructive">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" className="mr-2" size={20} />
                  Войти
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
