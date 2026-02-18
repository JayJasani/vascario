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
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

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

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item })
  const removeItem = (id: string, size: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } })
  const updateQuantity = (id: string, size: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })

  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
