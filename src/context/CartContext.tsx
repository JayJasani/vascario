"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "UPDATE_PRICES"; payload: { id: string; size: string; price: number }[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      )
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === existing.id && item.size === existing.size
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return { items: [...state.items, action.payload] }
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) =>
            !(item.id === action.payload.id && item.size === action.payload.size)
        ),
      }
    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      }
    case "CLEAR_CART":
      return { items: [] }
    case "HYDRATE":
      return { items: action.payload }
    case "UPDATE_PRICES":
      if (!action.payload.length) return state
      return {
        items: state.items.map((item) => {
          const match = action.payload.find(
            (u) => u.id === item.id && u.size === item.size
          )
          if (!match) return item
          if (typeof match.price !== "number" || !Number.isFinite(match.price)) {
            return item
          }
          if (match.price === item.price) {
            return item
          }
          return { ...item, price: match.price }
        }),
      }
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  refreshPrices: (updates: { id: string; size: string; price: number }[]) => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | null>(null)

/** Default no-op cart when rendered outside CartProvider (e.g. SSR/streaming edge case). */
const defaultCartValue: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  refreshPrices: () => {},
  cartTotal: 0,
  cartCount: 0,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const storageKey = user ? `vascario:cart:${user.uid}` : null

  // Hydrate from localStorage when user changes
  useEffect(() => {
    if (!storageKey) {
      dispatch({ type: "HYDRATE", payload: [] })
      return
    }
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        dispatch({ type: "HYDRATE", payload: parsed })
      }
    } catch (err) {
      console.error("Failed to load cart from storage", err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // Persist whenever cart or user changes
  useEffect(() => {
    if (!storageKey) return
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state.items))
    } catch (err) {
      console.error("Failed to save cart to storage", err)
    }
  }, [state.items, storageKey])

  // Hydrate from server (Firestore) so cart is shared across browsers
  useEffect(() => {
    if (!user) {
      // When logged out, ensure in-memory cart is cleared
      dispatch({ type: "HYDRATE", payload: [] })
      return
    }
    // If we already have items (from localStorage or a previous server sync), skip loading again
    if (state.items.length > 0) {
      return
    }
    let cancelled = false

    const loadFromServer = async () => {
      try {
        const res = await fetch("/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!res.ok) return

        const data = (await res.json()) as {
          items?: {
            productId: string
            name: string
            price: number
            image: string
            size: string
            quantity: number
          }[]
        }
        if (!data.items || cancelled) return

        const serverItems: CartItem[] = data.items
          .map((item) => {
            if (
              !item.productId ||
              typeof item.productId !== "string" ||
              !item.size ||
              typeof item.size !== "string" ||
              typeof item.price !== "number" ||
              !Number.isFinite(item.price) ||
              typeof item.quantity !== "number" ||
              !Number.isFinite(item.quantity) ||
              item.quantity <= 0
            ) {
              return null
            }
            return {
              id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
              size: item.size,
              quantity: item.quantity,
            } as CartItem
          })
          .filter((item): item is CartItem => item !== null)

        if (cancelled) return
        dispatch({ type: "HYDRATE", payload: serverItems })
      } catch (err) {
        console.error("Failed to load cart from server", err)
      }
    }

    loadFromServer()

    return () => {
      cancelled = true
    }
  }, [user, state.items.length])

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item })
  const removeItem = (id: string, size: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } })
  const updateQuantity = (id: string, size: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })
  const refreshPrices = (updates: { id: string; size: string; price: number }[]) =>
    dispatch({ type: "UPDATE_PRICES", payload: updates })

  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, refreshPrices, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  return context ?? defaultCartValue
}
