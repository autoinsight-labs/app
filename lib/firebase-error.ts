import type { FirebaseError } from 'firebase/app'

export function getAuthErrorMessage(error: unknown): string {
  const err = error as Partial<FirebaseError> & {
    code?: string
    message?: string
  }
  const code = err?.code || ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha inválidos.'
    case 'auth/invalid-email':
      return 'Endereço de e-mail inválido.'
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.'
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet e tente novamente.'
    case 'auth/email-already-in-use':
      return 'E-mail já cadastrado.'
    case 'auth/weak-password':
      return 'Senha muito fraca. Use ao menos 6 caracteres.'
    default:
      return err?.message || 'Ocorreu um erro. Tente novamente.'
  }
}
