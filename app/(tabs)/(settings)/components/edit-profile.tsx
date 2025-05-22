import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/lib/use-color-scheme'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Pressable, View } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

const editProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome precisa ter pelo menos 3 caracteres.' })
    .max(50, { message: 'Nome não pode ter mais que 50 caracteres.' }),
  email: z
    .string()
    .email({ message: 'Endereço de email inválido.' })
    .max(100, { message: 'Email não pode ter mais que 100 caracteres.' }),
})

type EditProfileSchema = z.infer<typeof editProfileSchema>

export function EditProfile() {
  const { colorScheme } = useColorScheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const [profile, setProfile] = useState({
    name: 'Guilherme Maggiorini',
    email: 'guimaggiorini@gmail.com',
  })

  const { control, handleSubmit, reset } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  function onSubmit(data: EditProfileSchema) {
    toast.success('Perfil atualizado!')
    setProfile(data)
    bottomSheetModalRef.current?.dismiss()
  }

  const handlePresentModalPress = useCallback(() => {
    reset()
    bottomSheetModalRef.current?.present()
  }, [reset])

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
        <View className="flex-row w-full items-center justify-between gap-3 bg-muted px-5 py-4 rounded-2xl">
          <View className="flex-row items-center gap-3">
            <Image
              source={require('@/assets/unknown-user.jpg')}
              className="size-16 rounded-full"
            />
            <View className="flex flex-col">
              <Text className="text-xl font-semibold leading-none">
                {profile.name}
              </Text>
              <Text className="text-muted-foreground leading-1">
                {profile.email}
              </Text>
            </View>
          </View>
          <ChevronRight color={Colors[colorScheme].text} size={24} />
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
          <View className="flex flex-col gap-4 w-full">
            <Text className="text-xl font-semibold">Editar perfil</Text>
            <View className="flex flex-col w-full">
              <Controller
                name="name"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <FormField required label="Nome" errorMsg={error?.message}>
                    <Input
                      placeholder="Linus Torvalds"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="words"
                      hasError={!!error}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <FormField required label="Email" errorMsg={error?.message}>
                    <Input
                      placeholder="torvalds@linux-foundation.org"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      hasError={!!error}
                    />
                  </FormField>
                )}
              />
            </View>
            <Button onPress={handleSubmit(onSubmit)}>
              <Text>Salvar</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
