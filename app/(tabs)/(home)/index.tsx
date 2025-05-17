import { Text } from '@/components/ui/text'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-6">
      <Text className="text-2xl font-bold">Home</Text>
    </SafeAreaView>
  )
}
