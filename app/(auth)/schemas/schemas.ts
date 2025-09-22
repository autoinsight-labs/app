import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail deve ser válido')
    .max(150, 'E-mail deve ter no máximo 150 caracteres'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(150, 'Nome deve ter no máximo 150 caracteres'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail deve ser válido')
    .max(150, 'E-mail deve ter no máximo 150 caracteres'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
