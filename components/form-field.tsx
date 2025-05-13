import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'
import { toCapital } from '@/utils/utils'
import type { ReactNode } from 'react'
import { View } from 'react-native'

interface FormFieldProps {
  label: string
  htmlFor?: string
  errorMsg?: string
  children: ReactNode
  required?: boolean
  hasError?: boolean
  hasLabel?: boolean
}

export function FormField({
  label,
  htmlFor,
  errorMsg,
  children,
  required,
  hasError = true,
  hasLabel = true,
}: FormFieldProps) {
  return (
    <View className="flex min-w-0 flex-1 flex-col">
      <View className="flex flex-col gap-2">
        <Label
          htmlFor={htmlFor ?? label}
          className={`${errorMsg ? 'text-destructive' : 'text-foreground'} ${!hasLabel && 'hidden'
            }`}
        >
          {toCapital(label)}
          {required && <Text className={`${errorMsg ? 'text-destructive' : 'text-foreground'}`}>*</Text>}
        </Label>
        {children}
      </View>
      {hasError && (
        <View className="mt-1 min-h-[20px]">
          {errorMsg && (
            <Text className="text-destructive ml-1 line-clamp-1 text-[0.8rem] font-medium">
              {errorMsg}
            </Text>
          )}
        </View>
      )}
    </View>
  )
}
