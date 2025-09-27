import { Tabs } from 'expo-router'
import { Building2, Home, Settings } from 'lucide-react-native'

import { AuthGuard } from '@/components/auth-guard'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'

export default function TabLayout() {
  const { colorScheme } = useColorScheme()

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: { height: 60 },
          tabBarItemStyle: { gap: 6 },
        }}
      >
        <Tabs.Screen
          name="(home)/index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => (
              <Home color={color} className="size-5" />
            ),
          }}
        />
        <Tabs.Screen
          name="(yards)"
          options={{
            title: 'Pátio',
            tabBarIcon: ({ color }) => (
              <Building2 color={color} className="size-5" />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)/settings"
          options={{
            title: 'Config.',
            tabBarIcon: ({ color }) => (
              <Settings color={color} className="size-5" />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  )
}
