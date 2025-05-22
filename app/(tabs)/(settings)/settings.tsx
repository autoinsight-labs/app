import { Text } from '@/components/ui/text'
import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Developers } from './components/developers'
import { EditProfile } from './components/edit-profile'
import { SettingsHeader } from './components/settings-header'
import { ThemeChanger } from './components/theme-changer'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Guilherme Maggiorini',
    email: 'guimaggiorini@gmail.com',
  })

  return (
    <SafeAreaView className="flex-1 gap-8 items-center justify-center">
      <SettingsHeader name={profile.name} email={profile.email} />
      <View className="flex-1 w-full gap-8">
        <View className="flex flex-col w-full gap-2 px-6">
          <Text className="font-medium text-muted-foreground">Usuário</Text>
          <EditProfile onSave={setProfile} />
        </View>

        <View className="flex flex-col w-full gap-2 px-6">
          <Text className="font-medium text-muted-foreground">Sistema</Text>
          <ThemeChanger />
        </View>

        <View className="flex flex-col w-full gap-2 px-6">
          <Text className="font-medium text-muted-foreground">Sobre</Text>
          <Developers />
        </View>
      </View>
    </SafeAreaView>
  )
}
