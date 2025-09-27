import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { getYard, patchYard } from '@/lib/services/yards'
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
import { ActivityIndicator, View } from 'react-native'
import { toast } from 'sonner-native'
import { YardForm } from './yard-form'

export interface EditYardSheetRef {
  open: () => void
  close: () => void
}

interface EditYardSheetProps {
  yardId: string
  onUpdated?: (yard: Yard) => Promise<void> | void
}

export const EditYardSheet = forwardRef<EditYardSheetRef, EditYardSheetProps>(
  ({ yardId, onUpdated }, ref) => {
    const { colorScheme } = useColorScheme()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const [yard, setYard] = useState<Yard | null>(null)
    const [loading, setLoading] = useState(false)

    const snapPoints = useMemo(() => ['85%'], [])

    const fetchYard = useCallback(async () => {
      try {
        setLoading(true)
        const res = await getYard(String(yardId))
        setYard(res)
      } catch (e) {
        const err = e as { message?: string }
        toast.error(err.message ?? 'Não foi possível carregar o pátio')
      } finally {
        setLoading(false)
      }
    }, [yardId])

    const open = useCallback(() => {
      bottomSheetModalRef.current?.present()
      fetchYard()
    }, [fetchYard])

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

    async function handleSubmit(data: YardPatch) {
      try {
        setLoading(true)
        const updated = await patchYard(String(yardId), data)
        toast.success('Pátio atualizado!')
        close()
        await onUpdated?.(updated)
      } catch (e) {
        const err = e as { message?: string }
        toast.error(err.message ?? 'Não foi possível atualizar o pátio')
      } finally {
        setLoading(false)
      }
    }

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
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
          <Text className="text-xl font-semibold w-full">Editar pátio</Text>
          {!yard && (
            <View className="w-full py-8 items-center justify-center">
              <ActivityIndicator />
            </View>
          )}
          {yard && (
            <View className="w-full">
              <YardForm
                mode="edit"
                initial={yard}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  }
)

EditYardSheet.displayName = 'EditYardSheet'
