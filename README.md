# AutoInsight

## 📱 Sobre o Projeto

A **AutoInsight** é um aplicativo desenvolvido em React Native com Expo, feito para mapeamento inteligente de pátio e gestão de motos. O aplicativo foi projetado para facilitar o controle e monitoramento de frotas de motocicletas, oferecendo uma interface intuitiva para gerenciar manutenções e acompanhar informações em tempo real.

## 👥 Equipe de Desenvolvimento

| Nome | RM | E-mail | GitHub | LinkedIn |
|------|-------|---------|---------|----------|
| Arthur Vieira Mariano | RM554742 | arthvm@proton.me | [@arthvm](https://github.com/arthvm) | [arthvm](https://linkedin.com/in/arthvm/) |
| Guilherme Maggiorini | RM554745 | guimaggiorini@gmail.com | [@guimaggiorini](https://github.com/guimaggiorini) | [guimaggiorini](https://linkedin.com/in/guimaggiorini/) |
| Ian Rossato Braga | RM554989 | ian007953@gmail.com | [@iannrb](https://github.com/iannrb) | [ianrossato](https://linkedin.com/in/ianrossato/) |

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo móvel com Expo Go ou emulador Android/iOS

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/autoinsight-labs/app.git
   cd app
   ```

2. **Instale as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Inicie o projeto:**
   ```bash
   npx expo start
   ```

## 🏗️ Arquitetura e Tecnologias

### Stack Principal
- **React Native** 0.79.2
- **Expo** 53.0.9
- **TypeScript** 5.8.3
- **Expo Router** 5.0.6 (navegação)
- **NativeWind** 4.1.23 (styling)
- **TailwindCSS** 3.4.17

## 🎯 Principais Recursos

### Interface do Usuário
- **Tema Dinâmico:** Alternância entre claro/escuro/sistema
- **Bottom Sheets:** Modais deslizantes para melhor UX
- **Componentes Customizados:** Sistema de design consistente
- **Ícones:** Lucide React Native para ícones modernos

### Navegação
- **File-based Routing:** Expo Router para navegação intuitiva
- **Tab Navigation:** Navegação por abas principal
- **Modal Navigation:** Modais para ações específicas

### Gerenciamento de Estado
- **Local State:** useState para estados de componente
- **Form State:** React Hook Form para formulários
- **Persistent State:** AsyncStorage para dados persistentes

### Validação e Formulários
- **Schema Validation:** Zod para validação robusta
- **Real-time Feedback:** Validação em tempo real
- **Error Handling:** Mensagens de erro contextuais

## 📱 Funcionalidades do App

### Tela Principal (Home)
- Visualização de manutenção agendada
- Informações do responsável técnico
- Detalhes da motocicleta em serviço
- Integração com mapas para localização
- Status visual da manutenção

### Tela de Configurações
- **Edição de Perfil:** Formulário para alterar nome e e-mail
- **Seleção de Tema:** Escolha entre claro, escuro ou sistema
- **Sobre:** Informações dos desenvolvedores com links

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do challenge da Mottu FIAP.
