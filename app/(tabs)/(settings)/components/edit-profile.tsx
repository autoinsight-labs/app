import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useAuth } from '@/lib/contexts/auth'
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
import { SafeAreaView } from 'react-native-safe-area-context'
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
  const { user, updateProfile } = useAuth()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const [profile, setProfile] = useState({
    name: user?.displayName || 'Usuário',
    email: user?.email || 'email@exemplo.com',
  })

  const { control, handleSubmit, reset } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  async function onSubmit(data: EditProfileSchema) {
    try {
      await updateProfile({ name: data.name, email: data.email })
      toast.success('Perfil atualizado!')
      setProfile(data)
      bottomSheetModalRef.current?.dismiss()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      toast.error(message)
    }
  }

  const handlePresentModalPress = useCallback(() => {
    reset({ name: user?.displayName || '', email: user?.email || '' })
    bottomSheetModalRef.current?.present()
  }, [reset, user])

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
          <SafeAreaView
            className="flex flex-col gap-4 w-full"
            edges={['bottom']}
          >
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
          </SafeAreaView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}
