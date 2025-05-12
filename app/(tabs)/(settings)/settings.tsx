import { Button } from '@/components/ui/button'
import { useColorScheme } from '@/lib/use-color-scheme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Moon, Sun } from 'lucide-react-native'
import { useEffect } from 'react'
import { View } from 'react-native'
import { SettingsHeader } from './components/settings-header'

export default function Settings() {
  const { colorScheme, setColorScheme } = useColorScheme()

  const themeStorageKey = 'preferred-theme'

  async function updateTheme(theme: 'light' | 'dark' | 'system') {
    await AsyncStorage.setItem(themeStorageKey, theme)
    setColorScheme(theme)
  }

  useEffect(() => {
    async function getTheme() {
      const storedTheme = await AsyncStorage.getItem(themeStorageKey)
      if (
        storedTheme === 'light' ||
        storedTheme === 'dark' ||
        storedTheme === 'system'
      ) {
        setColorScheme(storedTheme)
      }
    }
    getTheme()
  }, [setColorScheme])

  return (
    <View className="flex-1 gap-4 items-center justify-center p-4">
      <SettingsHeader />
      <Button
        onPress={() => updateTheme(colorScheme === 'dark' ? 'light' : 'dark')}
        variant="ghost"
      >
        {colorScheme === 'dark' ? (
          <>
            <Sun size={20} color="#facc15" />
          </>
        ) : (
          <>
            <Moon className="text-blue-900" size={16} color="#1e293b" />
          </>
        )}
      </Button>
    </View>
  )
}
