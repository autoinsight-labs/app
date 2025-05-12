import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { View } from 'react-native'

export function SettingsHeader() {
  return (
    <View className="flex flex-col w-full gap-6 items-center">
      <Avatar alt="avatar" className="size-24">
        <AvatarImage />
        <AvatarFallback>
          <Text className="text-2xl">GM</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex flex-col w-full gap-1 items-center">
        <Text className="text-2xl font-semibold">Guilherme Maggiorini</Text>
        <Text className="text-lg text-muted-foreground">
          guihm929@gmail.com
        </Text>
      </View>
    </View>
  )
}
