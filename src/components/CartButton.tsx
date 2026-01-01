import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { getCartCount } from '@/lib/cart';

const CartButton = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setCount(getCartCount());
    
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => navigate('/cart')}
      className="relative"
    >
      <Icon name="ShoppingCart" size={24} />
      {count > 0 && (
        <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
          {count}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;
