import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { getCart, removeFromCart, updateQuantity, getCartTotal, clearCart, CartItem } from '@/lib/cart';
import { toast } from '@/components/ui/use-toast';

const YOOKASSA_API = 'https://functions.poehali.dev/474d7aa0-2d9e-4608-b099-6e7ba2167b08';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const loadCart = () => {
    setCart(getCart());
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    toast({ title: 'Товар удалён из корзины' });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    if (cart.length === 0) {
      toast({ title: 'Корзина пуста', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const cartItems = cart.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const total = getCartTotal();

      const response = await fetch(YOOKASSA_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          user_email: email,
          user_name: name,
          return_url: `${window.location.origin}/order-success`,
          cart_items: cartItems,
        }),
      });

      const data = await response.json();

      if (response.ok && data.payment_url) {
        clearCart();
        window.location.href = data.payment_url;
      } else {
        toast({ title: 'Ошибка создания платежа', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка соединения', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-4 border-primary/30 text-center">
          <CardHeader>
            <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <CardTitle className="text-2xl">Корзина пуста</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} size="lg" className="w-full">
              <Icon name="ArrowLeft" className="mr-2" size={20} />
              Вернуться к покупкам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b-4 border-primary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Корзина</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="border-4 border-primary/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-muted-foreground">{item.duration}</p>
                      <p className="text-2xl font-bold text-primary mt-2">{item.price}₽</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="text-xl font-bold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                      >
                        <Icon name="Trash2" size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="border-4 border-primary sticky top-4">
              <CardHeader>
                <CardTitle className="text-2xl">Оформление заказа</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.ru"
                      required
                    />
                  </div>

                  <div className="border-t-2 border-primary/30 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl">Итого:</span>
                      <span className="text-3xl font-bold text-primary">{total.toFixed(2)}₽</span>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                          Обработка...
                        </>
                      ) : (
                        <>
                          <Icon name="CreditCard" className="mr-2" size={20} />
                          Оплатить {total.toFixed(2)}₽
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Оплата через ЮKassa (карта/СБП)
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
