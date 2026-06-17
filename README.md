# Tiragem de Faltas CFC 2026

Aplicação web para o controle de faltas do Curso de Formação de Cabos (CFC 2026). A interface foi desenvolvida com React, Vite e Styled Components, com persistência imediata em Vercel Postgres.

## Recursos

- Tema militar moderno com verde oliva, preto e dourado
- Banner da turma no topo da página
- Busca por número ou nome de guerra
- Alteração rápida de status com select
- Salva as mudanças imediatamente no banco de dados
- Atualização automática em tempo real para todos os usuários
- Zeragem diária automática para CFC com registro de data
- Exportação em PDF dos dados e resumo final
- Pronto para deploy na Vercel

## Como usar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador.

## Deploy na Vercel

O projeto está configurado para deploy na Vercel com `vercel.json`:

- Front-end React em `src/`
- API de backend em `api/students.js`

## Banco de dados

A API `api/students.js` cria automaticamente as tabelas no Vercel Postgres:

- `students` — `id`, `number`, `name`, `status`
- `resets` — `id`, `reset_date`, `created_at`

A zeragem diária atualiza todos os estudantes para `CFC` apenas uma vez por dia.

## Estrutura do projeto

- `package.json` — dependências e scripts
- `vite.config.js` — configuração do Vite
- `vercel.json` — configuração de deploy na Vercel
- `src/main.jsx` — ponto de entrada React
- `src/App.jsx` — aplicação principal
- `src/components/` — componentes de interface
- `src/styles/` — estilos globais e tema
- `api/students.js` — endpoint de dados
- `sql/schema.sql` — esquema inicial do banco de dados

## Observações

- Não há autenticação.
- Qualquer pessoa com o link pode usar o sistema.
- A interface foi otimizada para conferência rápida em turma.
# cfc-2026ss
