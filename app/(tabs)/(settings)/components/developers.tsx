import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { ChevronRight, CodeXml, Github, Linkedin } from 'lucide-react-native'
import { useCallback, useRef } from 'react'
import { Image, Linking, Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function Developers() {
  const { colorScheme } = useColorScheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  )

  const developers = [
    {
      image: require('@/assets/developers/arthvm.jpeg'),
      name: 'Arthur Vieira Mariano',
      email: 'arthvm@proton.me',
      github: 'https://github.com/arthvm',
      linkedin: 'https://www.linkedin.com/in/arthvm/',
    },
    {
      image: require('@/assets/developers/guimaggiorini.jpeg'),
      name: 'Guilherme Maggiorini',
      email: 'guimaggiorini@gmail.com',
      github: 'https://github.com/guimaggiorini',
      linkedin: 'http://linkedin.com/in/guimaggiorini/',
    },
    {
      image: require('@/assets/developers/iannrb.jpeg'),
      name: 'Ian Rossato Braga',
      email: 'ian007953@gmail.com',
      github: 'https://github.com/iannrb',
      linkedin: 'http://linkedin.com/in/ianrossato/',
    },
  ]

  return (
    <>
      <Pressable onPress={handlePresentModalPress} className="w-full">
        <View className="flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center gap-4">
            <View className="p-3 rounded-2xl bg-input">
              <CodeXml color={Colors[colorScheme].text} size={20} />
            </View>
            <Text className="text-xl">Desenvolvedores</Text>
          </View>
          <ChevronRight color={Colors[colorScheme].text} size={20} />
        </View>
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={{
          borderWidth: 1,
          borderColor: Colors[colorScheme].border,
          backgroundColor: Colors[colorScheme].background,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors[colorScheme].border,
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex flex-col justify-center gap-4 px-6">
          <SafeAreaView
            className="flex flex-col gap-4 w-full"
            edges={['bottom']}
          >
            <Text className="text-xl font-semibold">Desenvolvedores</Text>
            <View className="flex flex-col w-full">
              {developers.map(developer => {
                return (
                  <View key={developer.name} className="w-full">
                    <View className="flex flex-row items-center justify-between w-full p-4 rounded-2xl">
                      <View className="flex flex-row items-center gap-2">
                        <View className="flex flex-row items-center">
                          <View className="size-14 rounded-full overflow-hidden">
                            <Image
                              source={developer.image}
                              className="w-full h-full"
                            />
                          </View>
                        </View>
                        <View className="flex flex-col">
                          <Text className="text-lg font-semibold">
                            {developer.name}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {developer.email}
                          </Text>
                        </View>
                      </View>
                      <View className="flex flex-row items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onPress={() => Linking.openURL(developer.github)}
                        >
                          <Github color={Colors[colorScheme].text} size={20} />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onPress={() => Linking.openURL(developer.linkedin)}
                        >
                          <Linkedin
                            color={Colors[colorScheme].text}
                            size={20}
                          />
                        </Button>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
