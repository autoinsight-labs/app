import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { createInvite } from '@/lib/services/invites'
import type { InviteRole } from '@/lib/types'
import { useColorScheme } from '@/lib/use-color-scheme'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

const inviteSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(120, 'Nome deve ter no máximo 120 caracteres'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail deve ser válido')
    .max(150, 'E-mail deve ter no máximo 150 caracteres'),
  role: z.enum(['ADMIN', 'MEMBER'], {
    required_error: 'Role é obrigatória',
    invalid_type_error: 'Role inválida',
  }),
})

export type InviteFormData = z.infer<typeof inviteSchema>

export interface InviteUserSheetRef {
  open: () => void
  close: () => void
}

interface InviteUserSheetProps {
  yardId: string
  onInvited?: () => Promise<void> | void
}

export const InviteUserSheet = forwardRef<
  InviteUserSheetRef,
  InviteUserSheetProps
>(({ yardId, onInvited }, ref) => {
  const { colorScheme } = useColorScheme()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: '', email: '', role: 'MEMBER' },
  })

  const role = watch('role') as InviteRole

  const open = useCallback(() => {
    reset({ name: '', email: '', role: 'MEMBER' })
    bottomSheetModalRef.current?.present()
  }, [reset])
  const close = useCallback(() => bottomSheetModalRef.current?.dismiss(), [])

  useImperativeHandle(ref, () => ({ open, close }), [open, close])

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

  async function onSubmit(data: InviteFormData) {
    try {
      await createInvite(String(yardId), {
        name: data.name?.trim() || data.email,
        email: data.email,
        role: data.role,
      })
      toast.success('Convite enviado!')
      close()
      await onInvited?.()
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível criar o convite')
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundStyle={{
        borderWidth: 1,
        borderColor: Colors[colorScheme].border,
        backgroundColor: Colors[colorScheme].background,
      }}
      handleIndicatorStyle={{ backgroundColor: Colors[colorScheme].border }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex flex-col items-center justify-center gap-4 px-6 py-4 pb-10">
        <View className="flex flex-col gap-4 w-full">
          <Text className="text-xl font-semibold">Convidar usuário</Text>
          <View className="flex flex-col w-full gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Nome"
                  required
                  errorMsg={errors.name?.message}
                  hasError={!!errors.name}
                >
                  <Input
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    placeholder="John Doe"
                    hasError={!!errors.name}
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <FormField
                  label="Email"
                  required
                  errorMsg={errors.email?.message}
                  hasError={!!errors.email}
                >
                  <Input
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="john.doe@example.com"
                    hasError={!!errors.email}
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="role"
              render={() => (
                <FormField label="Permissao" required>
                  <View className="flex-row gap-2">
                    <Button
                      variant={role === 'ADMIN' ? 'default' : 'secondary'}
                      onPress={() => setValue('role', 'ADMIN')}
                      className="flex-1"
                    >
                      <Text>Admin</Text>
                    </Button>
                    <Button
                      variant={role === 'MEMBER' ? 'default' : 'secondary'}
                      onPress={() => setValue('role', 'MEMBER')}
                      className="flex-1"
                    >
                      <Text>Membro</Text>
                    </Button>
                  </View>
                </FormField>
              )}
            />
            <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
              <Text>{isSubmitting ? 'Enviando...' : 'Enviar convite'}</Text>
            </Button>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

InviteUserSheet.displayName = 'InviteUserSheet'
