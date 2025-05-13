import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Text } from '@/components/ui/text'
import { getInitials } from '@/utils/utils'
import { View } from 'react-native'

interface SettingsHeaderProps {
  name: string
  email: string
}

export function SettingsHeader({ name, email }: SettingsHeaderProps) {
  return (
    <View className="flex flex-col w-full gap-6 items-center">
      <Avatar alt="avatar" className="size-24">
        <AvatarImage />
        <AvatarFallback>
          <Text className="text-2xl">{getInitials(name)}</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex flex-col w-full gap-1 items-center">
        <Text className="text-2xl font-semibold">{name}</Text>
        <Text className="text-lg text-muted-foreground">{email}</Text>
      </View>
    </View>
  )
}
