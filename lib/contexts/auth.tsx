import { getFirebaseAuth } from '@/lib/firebase'
import {
  type User,
  createUserWithEmailAndPassword,
  updateEmail as fbUpdateEmail,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface LoginFormData {
  email: string
  password: string
}

interface SignupFormData {
  name: string
  email: string
  password: string
}

interface UpdateProfileData {
  name?: string
  email?: string
}

interface AuthContextData {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginFormData) => Promise<void>
  signup: (data: SignupFormData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
}

const AuthContext = createContext<AuthContextData | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, current => {
      setUser(current)
      setIsLoading(false)
    })
    return () => unsub()
  }, [auth])

  const login = useCallback(
    async ({ email, password }: LoginFormData) => {
      setIsLoading(true)
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } finally {
        setIsLoading(false)
      }
    },
    [auth]
  )

  const signup = useCallback(
    async ({ name, email, password }: SignupFormData) => {
      setIsLoading(true)
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) {
          await fbUpdateProfile(cred.user, { displayName: name })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [auth]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
    } finally {
      setIsLoading(false)
    }
  }, [auth])

  const updateProfile = useCallback(
    async ({ name, email }: UpdateProfileData) => {
      if (!auth.currentUser) return
      if (name && name !== auth.currentUser.displayName) {
        await fbUpdateProfile(auth.currentUser, { displayName: name })
      }
      if (email && email !== auth.currentUser.email) {
        await fbUpdateEmail(auth.currentUser, email)
      }
    },
    [auth]
  )

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, signup, logout, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
