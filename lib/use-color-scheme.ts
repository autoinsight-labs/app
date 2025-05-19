import { useColorScheme as useNativewindColorScheme } from 'nativewind'
import { useEffect, useState } from 'react'

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme()
  const [scheme, setScheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    setScheme(colorScheme ?? 'dark')
  }, [colorScheme])

  return {
    colorScheme: scheme,
    isDarkColorScheme: scheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  }
}
