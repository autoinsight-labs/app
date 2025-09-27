import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useAuth } from '@/lib/contexts/auth'
import { useColorScheme } from '@/lib/use-color-scheme'
import { router } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import { Pressable } from 'react-native-gesture-handler'
import { toast } from 'sonner-native'

export function Logout() {
  const { colorScheme } = useColorScheme()
  const { logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logout realizado com sucesso!')
      router.replace('/')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <>
      <Pressable onPress={handleLogout} className="w-full">
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-4">
            <View className="p-3 rounded-2xl bg-input">
              <LogOut color={Colors[colorScheme].text} size={20} />
            </View>
            <Text className="text-xl">Sair da conta</Text>
          </View>
        </View>
      </Pressable>
    </>
  )
}
