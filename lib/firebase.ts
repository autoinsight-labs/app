import AsyncStorage from '@react-native-async-storage/async-storage'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import {
  type Auth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth'

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null

export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp

  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  firebaseApp = initializeApp(config)
  return firebaseApp
}

export function getFirebaseAuth(): Auth {
  if (firebaseAuth) return firebaseAuth
  const app = getFirebaseApp()
  const authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
  firebaseAuth = authInstance
  return authInstance
}
