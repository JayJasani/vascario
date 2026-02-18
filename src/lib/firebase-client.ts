"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let app: FirebaseApp;

if (!getApps().length) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn(
      "[firebase-client] NEXT_PUBLIC_FIREBASE_* env vars are not set. Client-side Firebase auth will not work until configured."
    );
  }

  app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
} else {
  app = getApp();
}

export const firebaseApp: FirebaseApp = app;
export const auth: Auth = getAuth(app);

