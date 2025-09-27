import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useAuth } from '@/lib/contexts/auth'
import { createYard } from '@/lib/services/yards'
import type { Yard, YardPatch } from '@/lib/types'
import { useColorScheme } from '@/lib/use-color-scheme'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner-native'
import type { CreateYardFormData } from './yard-form'
import { YardForm } from './yard-form'

export interface CreateYardSheetRef {
  open: () => void
  close: () => void
}

interface CreateYardSheetProps {
  onCreated?: (yard: Yard) => Promise<void> | void
}

export const CreateYardSheet = forwardRef<
  CreateYardSheetRef,
  CreateYardSheetProps
>(({ onCreated }, ref) => {
  const { user } = useAuth()
  const { colorScheme } = useColorScheme()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [loading, setLoading] = useState(false)

  const snapPoints = useMemo(() => ['85%'], [])

  const open = useCallback(() => {
    bottomSheetRef.current?.present()
  }, [])

  const close = useCallback(() => bottomSheetRef.current?.dismiss(), [])

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

  async function handleSubmit(data: CreateYardFormData | YardPatch) {
    try {
      setLoading(true)
      const payload = {
        ...data,
        ownerId: user?.uid ?? data.ownerId ?? '',
      } as CreateYardFormData
      if (!payload.ownerId) {
        throw new Error('OwnerId não encontrado')
      }
      const created = await createYard(payload)
      toast.success('Pátio criado com sucesso!')
      close()
      await onCreated?.(created)
    } catch (e) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Não foi possível criar o pátio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{
        borderWidth: 1,
        borderColor: Colors[colorScheme].border,
        backgroundColor: Colors[colorScheme].background,
      }}
      handleIndicatorStyle={{ backgroundColor: Colors[colorScheme].border }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 48,
          rowGap: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xl font-semibold w-full">Novo pátio</Text>
        <YardForm mode="create" onSubmit={handleSubmit} loading={loading} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})

CreateYardSheet.displayName = 'CreateYardSheet'
