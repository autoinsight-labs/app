import { View } from 'react-native'
import { SettingsHeader } from './components/settings-header'
import { ThemeChanger } from './components/theme-changer'

export default function Settings() {
  return (
    <View className="flex-1 gap-4 items-center justify-center p-4">
      <SettingsHeader />
      <ThemeChanger />
    </View>
  )
}
