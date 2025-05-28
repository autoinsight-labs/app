import { Tabs } from 'expo-router'
import { Home, Settings } from 'lucide-react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {
  const { colorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: insets.bottom,
          paddingTop: 8,
        },
        tabBarItemStyle: { gap: 6 },
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Home color={color} className="size-5" />,
          tabBarStyle: { marginBottom: -10 },
        }}
      />
      <Tabs.Screen
        name="(settings)/settings"
        options={{
          title: 'Config.',
          tabBarIcon: ({ color }) => (
            <Settings color={color} className="size-5" />
          ),
          tabBarStyle: { marginBottom: -10 },
        }}
      />
    </Tabs>
  )
}
