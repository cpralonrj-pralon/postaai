# PostaAI - Plataforma de Conteúdo com IA

O PostaAI é uma ferramenta poderosa projetada para criadores de conteúdo, utilizando Inteligência Artificial (Gemini) para gerar ideias, planejar calendários e facilitar a edição de posts.

## 🚀 Funcionalidades

- **Onboarding Personalizado**: Configure seu nicho e objetivos para recomendações precisas.
- **Gerador de Ideias de IA**: Sugestões automáticas baseadas em seu perfil.
- **Calendário Editorial**: Organize sua semana e acompanhe seus posts.
- **Editor de Conteúdo**: Interface intuitiva para criar carrosséis e posts estáticos.
- **Integração Gemini**: Utiliza o modelo `gemini-1.5-flash` para geração de conteúdo rápida e eficiente.

## 🛠️ Tecnologias

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Google Generative AI (Gemini)**
- **TypeScript**

## 📦 Como Rodar o Projeto

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure sua chave de API no arquivo `.env.local`:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🌐 Deploy

O projeto está configurado para ser hospedado via GitHub Pages. O `base` path foi definido como `./` para garantir a compatibilidade.