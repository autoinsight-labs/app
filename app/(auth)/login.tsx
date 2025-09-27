import { type LoginFormData, loginSchema } from '@/app/(auth)/schemas/schemas'
import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import Colors from '@/constants/Colors'
import { useAuth } from '@/lib/contexts/auth'
import { getAuthErrorMessage } from '@/lib/firebase-error'
import { useColorScheme } from '@/lib/use-color-scheme'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'

export default function Login() {
  const { login, isLoading } = useAuth()
  const { colorScheme } = useColorScheme()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
      toast.success('Login realizado com sucesso!')
      router.replace('/')
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center py-8">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo(a)!
            </Text>
            <Text className="text-lg text-muted-foreground">
              Faça login em sua conta para continuar
            </Text>
          </View>

          <View className="gap-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <FormField
                  label="Email"
                  errorMsg={errors.email?.message}
                  hasError={!!errors.email}
                >
                  <Input
                    placeholder="torvalds@linux-foundation.org"
                    value={value}
                    onChangeText={onChange}
                    hasError={!!errors.email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </FormField>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <FormField
                  label="Senha"
                  errorMsg={errors.password?.message}
                  hasError={!!errors.password}
                >
                  <View className="relative">
                    <Input
                      placeholder="********"
                      value={value}
                      onChangeText={onChange}
                      hasError={!!errors.password}
                      secureTextEntry={!showPassword}
                      editable={!isLoading}
                    />
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={20}
                          color={Colors[colorScheme].mutedForeground}
                        />
                      ) : (
                        <Eye
                          size={20}
                          color={Colors[colorScheme].mutedForeground}
                        />
                      )}
                    </Pressable>
                  </View>
                </FormField>
              )}
            />
          </View>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-8"
          >
            <Text>
              {isLoading ? (
                <ActivityIndicator
                  size={16}
                  className="text-primary-foreground"
                />
              ) : (
                'Entrar'
              )}
            </Text>
          </Button>

          <View className="mt-8 flex-row items-center gap-2 w-full justify-center">
            <Text className="text-muted-foreground">Não tem uma conta?</Text>
            <Pressable
              onPress={() => router.push('/(auth)/signup')}
              disabled={isLoading}
            >
              <Text className="text-primary font-semibold">Criar conta</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
