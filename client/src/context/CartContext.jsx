import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('bloom_cart')) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load); // [{ id, name, price, image, qty }]

  useEffect(() => localStorage.setItem('bloom_cart', JSON.stringify(items)), [items]);

  const add = (p) =>
    setItems((cur) => {
      const found = cur.find((i) => i.id === p._id);
      if (found) return cur.map((i) => (i.id === p._id ? { ...i, qty: i.qty + 1 } : i));
      return [...cur, { id: p._id, name: p.name, price: p.price, image: p.image, qty: 1 }];
    });
  const setQty = (id, qty) =>
    setItems((cur) => (qty < 1 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i))));
  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    [items]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
