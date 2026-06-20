# CFC 2026 - Sistema Completo com Tiragem de Faltas, Documentos e Canções

Sistema web completo para gerenciamento da Turma de Formação de Cabos (CFC 2026) com controle de tiragem de faltas, documentação centralizada e acervo de canções militares.

## 🎯 Funcionalidades

### 📋 Tiragem de Faltas
- Visualização em tempo real de todos os 40 alunos
- Sistema de status com 6 categorias (CFC, ESV, SSV, SDE, DSP, FLT)
- Mudança rápida de status através de select dropdown
- Sincronização automática entre navegadores
- Busca por número ou nome
- Exportação em PDF com data e resumo
- Zeragem automática diária (retorna todos ao status CFC)
- Atualização automática a cada 5 segundos

### 📄 Documentos
- Upload de arquivos PDF com categorias
- Organização por categorias militares:
  - Ordens do Dia
  - Escalas
  - Regulamentos
  - Comunicados
  - Instruções
  - Documentos Gerais
- Busca por nome de documento
- Filtro por categoria
- Download e visualização de PDFs
- Deletar documentos

### 🎵 Canções Militares
- Cadastro de canções com letras completas
- Organização por categorias:
  - Canções do Exército
  - Canções do CFC
  - Hinos
  - Canções de Marcha
  - Canções Motivacionais
- Busca por nome da canção
- Filtro por categoria
- Visualização de letras
- Deletar canções

## 🛠️ Estrutura Técnica

### Frontend
- **React 19.2.6** - Framework UI
- **Vite 8.0.12** - Build tool
- **Styled Components 6.0.0** - CSS-in-JS
- **jsPDF 2.5.1** - Geração de PDFs

### Backend & Database
- **Vercel Functions** - Serverless API
- **Vercel Postgres** - Database
- **@supabase/supabase-js** - Realtime updates

## 📊 Estrutura do Banco de Dados

### Tabela: `students`
```sql
- id (SERIAL PRIMARY KEY)
- numero (INTEGER UNIQUE)
- nome (TEXT)
- status (TEXT DEFAULT 'CFC')
```

### Tabela: `resets`
```sql
- id (SERIAL PRIMARY KEY)
- reset_date (DATE UNIQUE)
- created_at (TIMESTAMP)
```

### Tabela: `documents`
```sql
- id (SERIAL PRIMARY KEY)
- name (TEXT)
- category (TEXT)
- file_data (BYTEA)
- mime_type (TEXT DEFAULT 'application/pdf')
- date (TIMESTAMP)
```

### Tabela: `songs`
```sql
- id (SERIAL PRIMARY KEY)
- title (TEXT)
- category (TEXT)
- lyrics (TEXT)
- date (TIMESTAMP)
```

## 🚀 Deployment na Vercel

### Pré-requisitos
1. Conta na Vercel
2. Vercel Postgres Database criado
3. Supabase Project (para tiragem de faltas)

### Variáveis de Ambiente

`.env.local` (Local):
```
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

**Vercel Dashboard** → Settings → Environment Variables:
```
POSTGRES_URLCONNECT=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_USER=...
POSTGRES_DATABASE=...
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

### Deploy
```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Crie build local para testar
npm run build

# Deploy na Vercel (integração automática com GitHub)
# ou use CLI
vercel deploy
```

## 📁 Estrutura de Arquivos

```
cfc-26/
├── api/
│   ├── documents.js      # API para documentos
│   ├── songs.js          # API para canções
│   └── students.js       # API para alunos (Vercel Postgres)
├── src/
│   ├── assets/
│   │   ├── hero.png      # Banner turma
│   │   ├── logocfc2026.png # Logo
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Banner.jsx      # Banner principal
│   │   ├── Documents.jsx   # Seção de documentos
│   │   ├── Header.jsx      # Header com navegação
│   │   ├── SearchBar.jsx   # Barra de busca
│   │   ├── Songs.jsx       # Seção de canções
│   │   ├── StatusSelect.jsx
│   │   ├── StudentRow.jsx
│   │   ├── StudentTable.jsx
│   │   └── SummaryCard.jsx
│   ├── lib/
│   │   └── supabase.js     # Configuração Supabase
│   ├── styles/
│   │   ├── global.js       # Estilos globais
│   │   └── theme.js        # Tema e configurações
│   ├── App.jsx             # Componente principal
│   ├── index.css
│   └── main.jsx
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── sql/
├── .env.local
├── .gitignore
├── .vercelignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vercel.json
└── vite.config.js
```

## 🎨 Design System

### Paleta de Cores
- **Fundo**: `#0b1208` (Verde escuro militar)
- **Superfície**: `#11190f` (Verde escuro mais claro)
- **Accent**: `#d5b45a` (Dourado militar)
- **Texto**: `#f7f3df` (Bege claro)
- **Mutado**: `#a8a58a` (Cinza militar)

### Cores de Status
- **CFC**: `#48bb78` (Verde)
- **ESV**: `#3b82f6` (Azul)
- **SSV**: `#facc15` (Amarelo)
- **SDE**: `#f97316` (Laranja)
- **DSP**: `#6b7280` (Cinza)
- **FLT**: `#ef4444` (Vermelho)

## 🔄 Fluxo de Atualização em Tempo Real

1. **Tiragem de Faltas**: Usa Supabase Realtime para sync instantâneo
2. **Documentos**: Fetch automático ao carregar página
3. **Canções**: Fetch automático ao carregar página
4. **Polling automático**: A cada 5 segundos na seção de faltas

## 🔐 Segurança

- Sem autenticação necessária (acesso público com link)
- Supabase RLS policies (Row Level Security) para proteção
- CORS configurado via Vercel
- Sem exposição de dados sensíveis

## 📱 Responsividade

Totalmente responsivo para:
- 📱 Celulares (320px+)
- 📱 Tablets (720px+)
- 💻 Desktop (1200px+)

## 🚀 Performance

- Build otimizado com Vite
- Code splitting automático
- Lazy loading de componentes
- Cache de assets
- Gzip compression

## 📝 Alunos Cadastrados (40)

01 WALLACE, 02 GUEDES, 03 OLIVEIRA, 04 GALVÃO, 05 FONSECA, 06 CARVALHO, 07 CAMARGO, 08 RIBEIRO, 09 TALLIS, 10 LA RUBIA, 11 NASCIMENTO, 12 LUCAS MACEDO, 13 RICK, 14 EDUARDO F, 15 BRAVIM, 16 ADIEL, 17 FLORES, 18 JORGE, 19 GUIMARÃES, 20 JAMOCELLI, 21 ISRAEL, 22 OLIVEIRA, 23 MAIA, 24 MOURA, 25 KEYNER, 26 MARCON, 27 FRIESEN, 28 SILVESTRE, 29 SABINO, 30 DOLINSKI, 31 J. CASTRO, 32 FLAUZINO, 33 BRITO, 34 PICUSSA, 35 MIKTIV, 36 ALLAN, 37 ALVES, 38 RIBEIRO, 39 FRUTUOSO, 40 FAGUNDES

## 🛠️ Instalação Local

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Pré-visualizar build
npm preview

# Linter
npm run lint
```

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, entre em contato com o administrador do sistema.

---

**Desenvolvido com ❤️ para o CFC 2026**

*Identidade visual militar • Segurança • Performance*
