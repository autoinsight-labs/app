import { FormField } from '@/components/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/lib/contexts/auth'
import type { Yard, YardPatch } from '@/lib/types'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { z } from 'zod'

const addressSchema = z.object({
  country: z.string().min(1, 'País é obrigatório'),
  state: z.string().min(1, 'Estado é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  complement: z.string().optional().nullable(),
})

export const createYardSchema = z.object({
  ownerId: z.string().min(1),
  address: addressSchema,
})

export type CreateYardFormData = z.infer<typeof createYardSchema>

interface YardFormProps {
  initial?: Partial<Yard>
  mode: 'create' | 'edit'
  loading?: boolean
  onSubmit: (data: CreateYardFormData | YardPatch) => Promise<void>
}

export function YardForm({ initial, mode, loading, onSubmit }: YardFormProps) {
  const { user } = useAuth()
  const [form, setForm] = useState<Partial<Yard>>(() => ({
    ownerId: initial?.ownerId ?? user?.uid ?? '',
    address: {
      country: initial?.address?.country ?? '',
      state: initial?.address?.state ?? '',
      city: initial?.address?.city ?? '',
      zipCode: initial?.address?.zipCode ?? '',
      neighborhood: initial?.address?.neighborhood ?? '',
      complement: initial?.address?.complement ?? '',
    },
  }))
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const isEdit = mode === 'edit'

  const handleChange = (path: string, value: string) => {
    setForm(prev => {
      const next: Partial<Yard> = { ...prev }
      const parts = path.split('.')
      let cursor: Record<string, unknown> = next as unknown as Record<
        string,
        unknown
      >
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i]
        const current = (cursor[k] as Record<string, unknown> | undefined) ?? {}
        cursor[k] = current
        cursor = current
      }
      cursor[parts[parts.length - 1]] = value
      return next
    })
  }

  const submitData = useMemo(() => {
    if (isEdit) {
      const fullPatch: YardPatch = {
        ownerId: form.ownerId || initial?.ownerId || user?.uid || '',
        address: {
          country: form.address?.country ?? initial?.address?.country ?? '',
          state: form.address?.state ?? initial?.address?.state ?? '',
          city: form.address?.city ?? initial?.address?.city ?? '',
          zipCode: form.address?.zipCode ?? initial?.address?.zipCode ?? '',
          neighborhood:
            form.address?.neighborhood ?? initial?.address?.neighborhood ?? '',
          complement:
            (form.address?.complement ?? initial?.address?.complement) || null,
        },
      }
      return fullPatch
    }
    return {
      ownerId: form.ownerId || user?.uid || '',
      address: {
        country: form.address?.country || '',
        state: form.address?.state || '',
        city: form.address?.city || '',
        zipCode: form.address?.zipCode || '',
        neighborhood: form.address?.neighborhood || '',
        complement: (form.address?.complement ?? undefined) || undefined,
      },
    } satisfies CreateYardFormData
  }, [form, initial, isEdit, user?.uid])

  const validate = () => {
    setErrors({})
    const parsed = createYardSchema.safeParse(
      isEdit
        ? {
            ownerId: (submitData as YardPatch).ownerId,
            address: (submitData as YardPatch).address,
          }
        : submitData
    )
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || '_form'
        fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit(submitData as CreateYardFormData | YardPatch)
  }

  return (
    <View className="flex flex-col">
      {errors._form && <Text className="text-destructive">{errors._form}</Text>}
      {!isEdit && (
        <View style={{ height: 0, overflow: 'hidden' }}>
          <Input
            value={form.ownerId ?? ''}
            onChangeText={t => handleChange('ownerId', t)}
            placeholder="Owner UID"
            editable={false}
          />
        </View>
      )}
      <FormField label="Pais" required errorMsg={errors['address.country']}>
        <Input
          value={form.address?.country ?? ''}
          onChangeText={t => handleChange('address.country', t)}
          placeholder="Brasil"
        />
      </FormField>
      <FormField label="Estado" required errorMsg={errors['address.state']}>
        <Input
          value={form.address?.state ?? ''}
          onChangeText={t => handleChange('address.state', t)}
          placeholder="SP"
        />
      </FormField>
      <FormField label="Cidade" required errorMsg={errors['address.city']}>
        <Input
          value={form.address?.city ?? ''}
          onChangeText={t => handleChange('address.city', t)}
          placeholder="São Paulo"
        />
      </FormField>
      <FormField label="Cep" required errorMsg={errors['address.zipCode']}>
        <Input
          value={form.address?.zipCode ?? ''}
          onChangeText={t => handleChange('address.zipCode', t)}
          placeholder="00000-000"
        />
      </FormField>
      <FormField
        label="Bairro"
        required
        errorMsg={errors['address.neighborhood']}
      >
        <Input
          value={form.address?.neighborhood ?? ''}
          onChangeText={t => handleChange('address.neighborhood', t)}
          placeholder="Bairro"
        />
      </FormField>
      <FormField label="Complemento" errorMsg={errors['address.complement']}>
        <Input
          value={form.address?.complement ?? ''}
          onChangeText={t => handleChange('address.complement', t)}
          placeholder="Casa"
        />
      </FormField>

      <Button onPress={handleSubmit} disabled={loading}>
        <Text>{isEdit ? 'Salvar alterações' : 'Criar pátio'}</Text>
      </Button>
    </View>
  )
}
