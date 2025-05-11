import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useColorScheme } from '@/lib/use-color-scheme'
import { Moon, Sun } from 'lucide-react-native'
import { View } from 'react-native'

export default function TabTwoScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme()

  return (
    <View className="flex-1 gap-4 items-center justify-center p-4">
      <Text className="text-xl font-bold">Settings</Text>
      <Button onPress={toggleColorScheme} variant="ghost">
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
