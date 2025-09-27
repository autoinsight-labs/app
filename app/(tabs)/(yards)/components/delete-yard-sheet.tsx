import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { deleteYard } from '@/lib/services/yards'
import { useColorScheme } from '@/lib/use-color-scheme'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
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

export interface DeleteYardSheetRef {
  open: (yardId: string) => void
  close: () => void
}

interface DeleteYardSheetProps {
  onDeleted?: (yardId: string) => Promise<void> | void
}

export const DeleteYardSheet = forwardRef<DeleteYardSheetRef, DeleteYardSheetProps>(
  ({ onDeleted }, ref) => {
    const { colorScheme } = useColorScheme()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const [targetId, setTargetId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const snapPoints = useMemo(() => ['40%'], [])

    const open = useCallback((yardId: string) => {
      setTargetId(yardId)
      bottomSheetModalRef.current?.present()
    }, [])

    const close = useCallback(() => bottomSheetModalRef.current?.dismiss(), [])

    useImperativeHandle(ref, () => ({ open, close }), [open, close])

    const renderBackdrop = useCallback(
      (props: BottomSheetDefaultBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    )

    async function handleDelete() {
      if (!targetId) return
      try {
        setLoading(true)
        await deleteYard(targetId)
        toast.success('Pátio excluído com sucesso!')
        close()
        await onDeleted?.(targetId)
      } catch (e) {
        const err = e as { message?: string }
        toast.error(err.message ?? 'Não foi possível excluir o pátio')
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
        <BottomSheetView className="flex flex-col items-center justify-center gap-4 px-6 py-6">
          <View className="w-full gap-2">
            <Text className="text-xl font-semibold">Excluir pátio</Text>
            <Text className="text-muted-foreground">
              Essa ação não pode ser desfeita. Tem certeza que deseja excluir este pátio?
            </Text>
          </View>
          <View className="flex-row gap-3 w-full mt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onPress={close}
              disabled={loading}
            >
              <Text>Cancelar</Text>
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onPress={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors[colorScheme].background} />
              ) : (
                <Text className="text-destructive-foreground">Excluir</Text>
              )}
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

DeleteYardSheet.displayName = 'DeleteYardSheet'
