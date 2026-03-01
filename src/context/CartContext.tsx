"use client"

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
  slug?: string
  color?: string
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
  /** True once cart has loaded from server (or cleared for guest) - use to avoid race with item_id add */
  hasHydrated: boolean
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
  hasHydrated: false,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [hasHydrated, setHasHydrated] = useState(false)

  // Hydrate from server (Firestore) so cart is shared across browsers
  useEffect(() => {
    if (!user) {
      // When logged out, ensure in-memory cart is cleared
      dispatch({ type: "HYDRATE", payload: [] })
      setHasHydrated(true)
      return
    }
    let cancelled = false
    setHasHydrated(false)

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
      } finally {
        if (!cancelled) setHasHydrated(true)
      }
    }

    loadFromServer()

    return () => {
      cancelled = true
    }
  }, [user])

  // Persist cart to server whenever it changes for a logged-in user (debounced to avoid spam)
  useEffect(() => {
    if (!user) return
    if (typeof window === "undefined") return

    const controller = new AbortController()

    const timeoutId = window.setTimeout(() => {
      ;(async () => {
        try {
          const res = await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: state.items.map((item) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                size: item.size,
                quantity: item.quantity,
              })),
            }),
            signal: controller.signal,
          })
          if (!res.ok) {
            // Non-fatal: just log so UI stays responsive
            console.error(
              "Failed to sync cart to server",
              await res.text().catch(() => ""),
            )
          }
        } catch (err) {
          if ((err as any)?.name === "AbortError") return
          console.error("Error syncing cart to server", err)
        }
      })()
    }, 400)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [user, state.items])

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
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, refreshPrices, cartTotal, cartCount, hasHydrated }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  return context ?? defaultCartValue
}
