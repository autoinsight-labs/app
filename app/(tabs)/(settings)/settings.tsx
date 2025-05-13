import { useState } from 'react'
import { View } from 'react-native'
import { EditProfile } from './components/edit-profile'
import { SettingsHeader } from './components/settings-header'
import { ThemeChanger } from './components/theme-changer'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Guilherme Maggiorini',
    email: 'guimaggiorini@gmail.com',
  })

  return (
    <View className="flex-1 gap-4 items-center justify-center p-4">
      <SettingsHeader name={profile.name} email={profile.email} />
      <ThemeChanger />
      <EditProfile onSave={setProfile} />
    </View>
  )
}
