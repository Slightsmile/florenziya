import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { products } from "../data/products";
import { MAX_QUANTITY_PER_ITEM } from "../lib/money";

const CartContext = createContext(null);

const STORAGE_KEY = "florenziya_cart";

function sanitizeLoaded(raw) {
  if (!Array.isArray(raw)) return [];
  const catalog = new Map(products.map((p) => [p.id, p]));
  const out = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const product = catalog.get(entry.id);
    const quantity = Number(entry.quantity);
    if (!product || !Number.isInteger(quantity) || quantity <= 0) continue;
    out.push({ ...product, quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM) });
  }
  return out;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sanitizeLoaded(JSON.parse(raw));
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, quantity } = action.payload;
      const qty = Math.max(1, Math.min(quantity, MAX_QUANTITY_PER_ITEM));
      const existing = state.find((item) => item.id === product.id);
      if (existing) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + qty, MAX_QUANTITY_PER_ITEM) }
            : item
        );
      }
      return [...state, { ...product, quantity: qty }];
    }
    case "INCREMENT":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY_PER_ITEM) }
          : item
      );
    case "DECREMENT":
      return state
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadInitialState);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      // Persist only {id, quantity}: never trust stored prices/names.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })))
      );
    } catch {
      // Storage can be unavailable (private mode, quota) - cart stays in memory.
    }
  }, [items]);

  const addToCart = useCallback(
    (product, quantity = 1) => dispatch({ type: "ADD", payload: { product, quantity } }),
    []
  );
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const increment = useCallback((id) => dispatch({ type: "INCREMENT", payload: { id } }), []);
  const decrement = useCallback((id) => dispatch({ type: "DECREMENT", payload: { id } }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: "REMOVE", payload: { id } }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      increment,
      decrement,
      removeFromCart,
      clearCart,
      itemCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
    }),
    [items, addToCart, increment, decrement, removeFromCart, clearCart, itemCount, subtotal, isCartOpen, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
