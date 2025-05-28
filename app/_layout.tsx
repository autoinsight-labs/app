import Colors from '@/constants/Colors'
import '@/global.css'
import { useColorScheme } from '@/lib/use-color-scheme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Toaster } from 'sonner-native'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: Colors.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: Colors.dark,
}

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  const hasMounted = useRef(false)
  const { setColorScheme, isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    async function loadTheme() {
      const themeStorageKey = 'preferred-theme'
      const storedTheme = await AsyncStorage.getItem(themeStorageKey)
      if (
        storedTheme === 'light' ||
        storedTheme === 'dark' ||
        storedTheme === 'system'
      ) {
        setColorScheme(storedTheme)
      }
      setIsColorSchemeLoaded(true)
    }

    if (Platform.OS === 'web') {
      document.documentElement.classList.add('bg-background')
    }

    loadTheme()
    hasMounted.current = true
  }, [setColorScheme])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }} />
            <Toaster
              position="top-center"
              theme={isDarkColorScheme ? 'dark' : 'light'}
              richColors
            />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? useEffect
    : useLayoutEffect
