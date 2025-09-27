# AutoInsight

## Sobre o Projeto

A **AutoInsight** é um aplicativo desenvolvido em React Native com Expo, feito para mapeamento inteligente de pátio e gestão de motos. O aplicativo foi projetado para facilitar o controle e monitoramento de frotas de motocicletas, oferecendo uma interface intuitiva para gerenciar e acompanhar informações.

## Equipe de Desenvolvimento

| Nome | RM | E-mail | GitHub | LinkedIn |
|------|-------|---------|---------|----------|
| Arthur Vieira Mariano | RM554742 | arthvm@proton.me | [@arthvm](https://github.com/arthvm) | [arthvm](https://linkedin.com/in/arthvm/) |
| Guilherme Henrique Maggiorini | RM554745 | guimaggiorini@gmail.com | [@guimaggiorini](https://github.com/guimaggiorini) | [guimaggiorini](https://linkedin.com/in/guimaggiorini/) |
| Ian Rossato Braga | RM554989 | ian007953@gmail.com | [@iannrb](https://github.com/iannrb) | [ianrossato](https://linkedin.com/in/ianrossato/) |

## Como Executar

Pré-requisitos: Node 18+, npm, Expo CLI, e Expo Go (ou emulador iOS/Android).

1) Instale dependências
   ```bash
   npm install --legacy-peer-deps
   ```
2) Configure variáveis de ambiente (veja abaixo)
3) Rode o app
   ```bash
   npx expo start
   ```

## Variáveis de Ambiente

Crie um arquivo .env com:

```env
# Firebase Auth
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Backend
EXPO_PUBLIC_API_BASE_URL=http://localhost:5100
```

Se não definido, o backend usa http://localhost:5100 por padrão.

## Stack
- React Native + Expo (Expo Router)
- TypeScript
- NativeWind + TailwindCSS
- Firebase Auth

## Autenticação (Firebase)
O `AuthProvider` em `lib/contexts/auth.tsx` observa o estado com `onAuthStateChanged` e expõe `user`, `isAuthenticated`, `login`, `signup`, `logout` e `updateProfile`. A inicialização (com persistência via AsyncStorage) está em `lib/firebase.ts`, e erros amigáveis em `lib/firebase-error.ts`. Telas: `app/(auth)/login.tsx` e `app/(auth)/signup.tsx`.

## Yards, Employees e Convites
- Serviços: `lib/services/yards.ts`, `lib/services/yard-employees.ts`, `lib/services/invites.ts` (cliente HTTP em `lib/api.ts`, tipos em `lib/types.ts`).
- Tela principal de pátio: `app/(tabs)/(yards)/index.tsx`.
- Fluxo: o app tenta identificar automaticamente um pátio do usuário (se é dono ou membro). Se houver pátio: lista funcionários e convites pendentes do pátio; se não houver: mostra convites pessoais (por e‑mail) para aceitar/recusar. Ações de criar/editar/excluir pátio e convidar estão em bottom sheets na mesma rota.

## Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do challenge da Mottu FIAP.
