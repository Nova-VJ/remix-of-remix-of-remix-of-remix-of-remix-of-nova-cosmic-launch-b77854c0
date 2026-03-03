import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'service' | 'package';
  isMonthly?: boolean;
  isFree?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'isFree'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  isPromoApplied: boolean;
  applyPromo: () => boolean;
  getTotal: () => number;
  getDiscount: () => number;
  itemCount: number;
  freeItems: CartItem[];
}

const CartContext = createContext<CartContextType | null>(null);

const SERVICES = {
  web: { id: 'web', name: 'Páginas web que convierten', price: 600, type: 'service' as const },
  apps: { id: 'apps', name: 'Aplicaciones móviles', price: 1700, type: 'service' as const },
  social: { id: 'social', name: 'Contenido para redes sociales', price: 500, type: 'service' as const, isMonthly: true },
  branding: { id: 'branding', name: 'Branding profesional', price: 200, type: 'service' as const },
  marketing: { id: 'marketing', name: 'Marketing Digital - Estrategia', price: 200, type: 'service' as const },
  sem: { id: 'sem', name: 'SEM - Posicionamiento Google', price: 150, type: 'service' as const, isMonthly: true },
};

const PACKAGES = {
  pro: { id: 'pkg-pro', name: 'Paquete Pro', price: 800, type: 'package' as const, includes: ['web', 'social'], freeItems: ['marketing'] },
  plus: { id: 'pkg-plus', name: 'Paquete Plus', price: 1900, type: 'package' as const, includes: ['web', 'social', 'branding', 'apps'], freeItems: ['marketing', 'sem'], noPromo: true },
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const addItem = (item: Omit<CartItem, 'isFree'>) => {
    setItems(prev => {
      // Don't add duplicates
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, { ...item, isFree: false }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setIsPromoApplied(false);
  };

  const applyPromo = (): boolean => {
    if (promoCode.toUpperCase() === 'NOVA20') {
      setIsPromoApplied(true);
      return true;
    }
    return false;
  };

  // Calculate free items based on cart contents
  const freeItems: CartItem[] = [];
  
  // Check for packages first
  const hasPackagePlus = items.find(i => i.id === 'pkg-plus');
  const hasPackagePro = items.find(i => i.id === 'pkg-pro');
  
  if (hasPackagePlus && !isPromoApplied) {
    // Paquete Plus: Marketing y SEM gratis (no se suma con NOVA30)
    if (!items.find(i => i.id === 'marketing')) {
      freeItems.push({ ...SERVICES.marketing, isFree: true });
    }
    if (!items.find(i => i.id === 'sem')) {
      freeItems.push({ ...SERVICES.sem, isFree: true });
    }
  } else if (hasPackagePro && !isPromoApplied) {
    // Paquete Pro: Marketing gratis
    if (!items.find(i => i.id === 'marketing')) {
      freeItems.push({ ...SERVICES.marketing, isFree: true });
    }
  } else if (!isPromoApplied) {
    // Count individual services (not packages)
    const serviceCount = items.filter(i => i.type === 'service').length;
    
    // 2+ servicios = Marketing Digital gratis
    if (serviceCount >= 2 && !items.find(i => i.id === 'marketing')) {
      freeItems.push({ ...SERVICES.marketing, isFree: true });
    }
    
    // 4+ servicios = SEM gratis (además de Marketing)
    if (serviceCount >= 4 && !items.find(i => i.id === 'sem')) {
      freeItems.push({ ...SERVICES.sem, isFree: true });
    }
  }

  const getTotal = () => {
    const baseTotal = items.reduce((sum, item) => sum + (item.isFree ? 0 : item.price), 0);
    if (isPromoApplied) {
      // NOVA20 = 20% descuento
      return baseTotal * 0.8;
    }
    return baseTotal;
  };

  const getDiscount = () => {
    if (!isPromoApplied) return 0;
    const baseTotal = items.reduce((sum, item) => sum + (item.isFree ? 0 : item.price), 0);
    return baseTotal * 0.2;
  };

  const itemCount = items.length + freeItems.length;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      promoCode,
      setPromoCode,
      isPromoApplied,
      applyPromo,
      getTotal,
      getDiscount,
      itemCount,
      freeItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { SERVICES, PACKAGES };
