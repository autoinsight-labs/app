import { useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { CreateYardSheet, type CreateYardSheetRef } from './components/create-yard-sheet'

export default function CreateYardScreen() {
  const router = useRouter()
  const ref = useRef<CreateYardSheetRef>(null)

  useEffect(() => {
    ref.current?.open()
  }, [])

  return (
    <CreateYardSheet
      ref={ref}
      onCreated={created => {
        router.replace({ pathname: '/(tabs)/(yards)', params: { id: created.id } })
      }}
    />
  )
}
