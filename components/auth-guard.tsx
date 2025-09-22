import { useAuth } from '@/lib/contexts/auth'
import { Redirect } from 'expo-router'
import type { ReactNode } from 'react'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator className="text-primary" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />
  }

  return <>{children}</>
}
