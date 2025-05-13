import { cn } from '@/utils/utils'
import * as React from 'react'
import { TextInput, type TextInputProps } from 'react-native'

type InputProps = TextInputProps & {
  hasError?: boolean
  className?: string
  placeholderClassName?: string
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderClassName, hasError, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'web:flex h-10 native:h-12 web:w-full rounded-xl border bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-1 transition-all duration-100',
          hasError ? 'border-destructive' : 'border-border',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          className
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
