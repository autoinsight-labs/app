import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'
import { openMaps } from '@/utils/utils'
import { History, MapPin } from 'lucide-react-native'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  const { colorScheme } = useColorScheme()

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-6 px-6">
      <View className="w-full items-start">
        <Text className="text-3xl font-semibold">Manutenção</Text>
      </View>
      <View className="flex relative w-full items-center justify-center">
        <View className="w-full h-60 rounded-2xl overflow-hidden border-2 border-muted shadow-lg/30">
          <Image
            source={
              colorScheme === 'dark'
                ? require('@/assets/maps/static-map-dark.png')
                : require('@/assets/maps/static-map-light.png')
            }
            className="w-full h-full"
          />
          <View
            className={`absolute inset-0 ${colorScheme === 'dark' ? 'bg-black/20' : 'bg-black/10'}`}
          />
        </View>
        <View className="flex-row items-center justify-between absolute bottom-4 bg-card p-4 rounded-2xl w-[90%]">
          <View>
            <Text className="text-lg font-medium">Mottu FIAP</Text>
            <Text className="text-muted-foreground">
              Av. Paulista, 1106 - SP
            </Text>
          </View>
          <Button
            variant="secondary"
            size="icon"
            onPress={() => openMaps('Av. Paulista, 1106 - SP')}
          >
            <MapPin color={Colors[colorScheme].text} size={18} />
          </Button>
        </View>
      </View>
      <View className="flex-1 w-full gap-8">
        <View className="flex flex-row w-full items-center justify-between">
          <View className="flex flex-col">
            <Text className="font-medium text-muted-foreground">Data</Text>
            <Text className="font-medium ">28/05/2006, 08:00</Text>
          </View>
          <Badge className="flex flex-row items-center justify-center gap-2 w-32">
            <History color="#FFFFFF" size={16} />
            <Text className="text-sm font-medium text-white">Agendado</Text>
          </Badge>
        </View>

        <View>
          <Text className="font-medium text-muted-foreground">Responsável</Text>
          <View className="flex-row items-center gap-3 px-5 py-4">
            <Image
              source={require('@/assets/unknown-user.jpg')}
              className="size-14 rounded-full"
            />
            <View className="flex flex-col">
              <Text className="text-xl font-medium leading-none">
                Arthur Mariano
              </Text>
              <Text className="text-muted-foreground leading-1">
                +55 11 99999-9999
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="font-medium text-muted-foreground">
            Moto em serviço
          </Text>
          <View className="flex-row items-center gap-3 px-5 py-4">
            <Image
              source={require('@/assets/bikes/E.webp')}
              className="size-14 rounded-full"
            />
            <View className="flex flex-col">
              <Text className="text-xl font-medium leading-none">Mottu E</Text>
              <Text className="text-muted-foreground leading-1">ABC1D23</Text>
            </View>
          </View>
        </View>

        <View className="flex flex-row gap-4 mt-auto">
          <Button
            className="flex-1 flex-row items-center justify-center gap-2"
            variant="destructive"
          >
            <Text className="font-medium text-destructive-foreground">
              Cancelar
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
