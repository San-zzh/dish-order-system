import { create } from 'zustand';

export interface CartItem {
  id: string;
  dishId: string;
  dishName: string;
  dishPrice: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.dishId === item.dishId);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.dishId === item.dishId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (dishId) => {
    set((state) => ({
      items: state.items.filter((i) => i.dishId !== dishId),
    }));
  },

  updateQuantity: (dishId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(dishId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.dishId === dishId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.dishPrice * item.quantity, 0);
  },
}));
