export interface CartItem {
  id: number;
  name: string;
  price: number;
  duration: string;
  quantity: number;
}

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: Omit<CartItem, 'quantity'>): void => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const removeFromCart = (productId: number): void => {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const updateQuantity = (productId: number, quantity: number): void => {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    }
  }
};

export const clearCart = (): void => {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cart-updated'));
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
