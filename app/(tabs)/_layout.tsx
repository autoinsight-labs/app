import { Tabs } from 'expo-router'
import { Home, Settings } from 'lucide-react-native'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'

export default function TabLayout() {
  const { colorScheme } = useColorScheme()

  return (
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
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} className="size-5" />,
        }}
      />
      <Tabs.Screen
        name="(settings)/settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Settings color={color} className="size-5" />
          ),
        }}
      />
    </Tabs>
  )
}
