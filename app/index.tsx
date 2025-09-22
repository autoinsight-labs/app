import { useAuth } from '@/lib/contexts/auth'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(home)" />
  }

  return <Redirect href="/(auth)/login" />
}
