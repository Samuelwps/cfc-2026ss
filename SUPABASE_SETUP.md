# Setup Supabase - CFC 2026

## 1. Criar conta no Supabase

1. Acesse https://app.supabase.com
2. Faça login com GitHub, Google ou email
3. Clique em "New project"
4. Preencha:
   - **Name**: `CFC-2026`
   - **Database Password**: crie uma senha forte
   - **Region**: escolha a mais próxima (ex: `us-east-1`)
5. Clique em "Create new project" e aguarde (2-5 minutos)

## 2. Pegar credenciais

1. No dashboard do projeto, clique em **Settings** (ícone de engrenagem)
2. Vá para **API**
3. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Clique em "anon" e copie a chave

## 3. Atualizar `.env.local`

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 4. Criar tabelas no Supabase

1. No dashboard, clique em **SQL Editor**
2. Clique em "New query"
3. Cole o conteúdo de `sql/supabase.sql`
4. Clique em "Run"

Pronto! As tabelas `students`, `resets` e `CFC` serão criadas com os 40 alunos.

## 5. Testar localmente

```bash
npm run dev
```

Acesse http://localhost:5175 e teste as alterações de status.

## 6. Deploy

```bash
npm run build
git push origin main  # Se estiver usando Git
```

Depois, conecte o repositório no Vercel e configure as variáveis de ambiente.

## Notas

- A chave `anon` é pública e segura para usar no frontend
- Row Level Security está habilitado para segurança
- Qualquer pessoa com o link pode usar o sistema (conforme requisito)
