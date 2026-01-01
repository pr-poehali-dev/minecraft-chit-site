import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

const API_URL = 'https://functions.poehali.dev/58157bac-8508-4720-85a0-89bae9d297a6';

interface Product {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  badge: string | null;
  is_popular: boolean;
  is_active: boolean;
}

interface Settings {
  [key: string]: {
    value: string;
    type: string;
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const token = localStorage.getItem('admin_token');
  const username = localStorage.getItem('admin_username');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [token, navigate]);

  const loadData = async () => {
    try {
      const [settingsRes, productsRes] = await Promise.all([
        fetch(`${API_URL}?action=settings`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}?action=products`),
      ]);

      const settingsData = await settingsRes.json();
      const productsData = await productsRes.json();

      setSettings(settingsData);
      setProducts(productsData);
    } catch (error) {
      toast({ title: 'Ошибка загрузки данных', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    const values: { [key: string]: string } = {};
    Object.keys(settings).forEach((key) => {
      values[key] = settings[key].value;
    });

    try {
      const response = await fetch(`${API_URL}?action=settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({ title: 'Настройки сохранены' });
        window.location.reload();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveProduct = async () => {
    if (!editProduct) return;

    const isNew = !editProduct.id;
    const url = isNew
      ? `${API_URL}?action=products`
      : `${API_URL}?action=products&id=${editProduct.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        toast({ title: isNew ? 'Продукт добавлен' : 'Продукт обновлён' });
        setIsDialogOpen(false);
        loadData();
      }
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Удалить продукт?')) return;

    try {
      const response = await fetch(`${API_URL}?action=products&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        toast({ title: 'Продукт удалён' });
        loadData();
      }
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b-4 border-primary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold">Админ панель</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">👤 {username}</span>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="settings">Настройки</TabsTrigger>
            <TabsTrigger value="products">Продукты</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-4 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Настройки сайта</CardTitle>
                <CardDescription>Управление ссылками и цветами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label>Discord URL</Label>
                    <Input
                      value={settings.discord_url?.value || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          discord_url: { value: e.target.value, type: 'url' },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telegram URL</Label>
                    <Input
                      value={settings.telegram_url?.value || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          telegram_url: { value: e.target.value, type: 'url' },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube Video ID</Label>
                    <Input
                      value={settings.youtube_video_id?.value || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          youtube_video_id: { value: e.target.value, type: 'text' },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Основной цвет (Primary)</Label>
                    <Input
                      value={settings.primary_color?.value || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          primary_color: { value: e.target.value, type: 'color' },
                        })
                      }
                      placeholder="270 60% 60%"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Второстепенный цвет (Secondary)</Label>
                    <Input
                      value={settings.secondary_color?.value || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          secondary_color: { value: e.target.value, type: 'color' },
                        })
                      }
                      placeholder="280 50% 50%"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} size="lg" className="w-full">
                  <Icon name="Save" className="mr-2" size={20} />
                  Сохранить настройки
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление продуктами</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() =>
                      setEditProduct({
                        id: 0,
                        name: '',
                        price: 0,
                        duration: 'Навсегда',
                        features: [],
                        badge: null,
                        is_popular: false,
                        is_active: true,
                      })
                    }
                  >
                    <Icon name="Plus" className="mr-2" size={20} />
                    Добавить продукт
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editProduct?.id ? 'Редактировать' : 'Добавить'} продукт
                    </DialogTitle>
                  </DialogHeader>
                  {editProduct && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Название</Label>
                        <Input
                          value={editProduct.name}
                          onChange={(e) =>
                            setEditProduct({ ...editProduct, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Цена (₽)</Label>
                        <Input
                          type="number"
                          value={editProduct.price}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Длительность</Label>
                        <Input
                          value={editProduct.duration}
                          onChange={(e) =>
                            setEditProduct({ ...editProduct, duration: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Особенности (по одной на строке)</Label>
                        <Textarea
                          value={editProduct.features.join('\n')}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              features: e.target.value.split('\n').filter((f) => f.trim()),
                            })
                          }
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Бейдж (опционально)</Label>
                        <Input
                          value={editProduct.badge || ''}
                          onChange={(e) =>
                            setEditProduct({ ...editProduct, badge: e.target.value || null })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={editProduct.is_popular}
                            onCheckedChange={(checked) =>
                              setEditProduct({ ...editProduct, is_popular: checked })
                            }
                          />
                          <Label>Популярный</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={editProduct.is_active}
                            onCheckedChange={(checked) =>
                              setEditProduct({ ...editProduct, is_active: checked })
                            }
                          />
                          <Label>Активен</Label>
                        </div>
                      </div>
                      <Button onClick={handleSaveProduct} className="w-full" size="lg">
                        <Icon name="Save" className="mr-2" size={20} />
                        Сохранить
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`border-4 ${product.is_active ? 'border-primary/30' : 'border-muted opacity-60'}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <CardDescription>
                          {product.price}₽ / {product.duration}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditProduct(product);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="text-sm">
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
