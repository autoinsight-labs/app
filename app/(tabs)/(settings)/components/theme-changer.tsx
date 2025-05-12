import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Check,
  Monitor,
  Moon,
  Palette,
  Settings2,
  Sun,
} from 'lucide-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'

const themes = [
  {
    key: 'light',
    label: 'Claro',
    icon: <Sun size={20} color="#facc15" />,
  },
  {
    key: 'dark',
    label: 'Escuro',
    icon: <Moon size={18} color="#5900b3" />,
  },
  {
    key: 'system',
    label: 'Sistema',
    icon: <Monitor size={18} color="#4f46e5" />,
  },
] as const

const THEME_STORAGE_KEY = 'preferred-theme'

export function ThemeChanger() {
  const { colorScheme, setColorScheme } = useColorScheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [selected, setSelected] = useState<'light' | 'dark' | 'system'>(
    'system'
  )

  useEffect(() => {
    ;(async () => {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (
        storedTheme === 'light' ||
        storedTheme === 'dark' ||
        storedTheme === 'system'
      ) {
        setSelected(storedTheme)
        setColorScheme(storedTheme)
      }
    })()
  }, [setColorScheme])

  const handleSelect = async (theme: 'light' | 'dark' | 'system') => {
    if (theme !== selected) {
      setSelected(theme)
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme)
      setColorScheme(theme)
    }
    bottomSheetModalRef.current?.dismiss()
  }

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

  return (
    <>
      <Pressable onPress={handlePresentModalPress} className="w-full">
        <View className="flex flex-row items-center justify-between w-full px-6 py-2">
          <View className="flex flex-row items-center gap-4">
            <View className="p-3 rounded-2xl bg-input">
              <Palette color={Colors[colorScheme].text} />
            </View>
            <Text className="text-2xl">Tema</Text>
          </View>
          <Settings2 color={Colors[colorScheme].text} />
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
        <BottomSheetView className="flex flex-col items-center justify-center gap-4 px-6 py-4 pb-10">
          {themes.map(theme => {
            const isSelected = theme.key === selected
            return (
              <Pressable
                key={theme.key}
                onPress={() => handleSelect(theme.key)}
                className="w-full"
                disabled={isSelected}
                style={isSelected ? { opacity: 0.5 } : undefined}
              >
                <Card className="w-full">
                  <CardContent className="flex flex-row w-full items-center gap-3 px-6 py-3">
                    {theme.icon}
                    <Text className="text-lg font-medium flex-1">
                      {theme.label}
                    </Text>
                    {isSelected && (
                      <Check
                        size={20}
                        strokeWidth={2.5}
                        color={Colors[colorScheme].tabIconDefault}
                      />
                    )}
                  </CardContent>
                </Card>
              </Pressable>
            )
          })}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
