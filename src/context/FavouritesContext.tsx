"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface FavouriteItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  /** Original price before discount, shown crossed out when present */
  cutPrice?: number | null;
  image: string;
}

interface FavouritesState {
  items: FavouriteItem[];
}

type FavouritesAction =
  | { type: "TOGGLE"; payload: FavouriteItem }
  | { type: "HYDRATE"; payload: FavouriteItem[] }
  | { type: "CLEAR" };

function favouritesReducer(
  state: FavouritesState,
  action: FavouritesAction
): FavouritesState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "HYDRATE":
      return { items: action.payload };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface FavouritesContextValue {
  items: FavouriteItem[];
  toggleFavourite: (item: FavouriteItem) => void;
  isFavourite: (id: string) => boolean;
  clearFavourites: () => void;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(
  undefined
);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(favouritesReducer, { items: [] });

  const storageKey = user ? `vascario:favourites:${user.uid}` : null;

  // Hydrate from localStorage when user changes
  useEffect(() => {
    if (!storageKey) {
      dispatch({ type: "HYDRATE", payload: [] });
      return;
    }
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(raw) as FavouriteItem[] });
      }
    } catch (err) {
      console.error("Failed to load favourites from storage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist whenever favourites or user changes
  useEffect(() => {
    if (!storageKey) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state.items));
    } catch (err) {
      console.error("Failed to save favourites to storage", err);
    }
  }, [state.items, storageKey]);

  const toggleFavourite = (item: FavouriteItem) =>
    dispatch({ type: "TOGGLE", payload: item });

  const isFavourite = (id: string) =>
    state.items.some((item) => item.id === id);

  const clearFavourites = () => dispatch({ type: "CLEAR" });

  return (
    <FavouritesContext.Provider
      value={{ items: state.items, toggleFavourite, isFavourite, clearFavourites }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return ctx;
}

