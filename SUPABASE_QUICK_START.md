# 🚀 Supabase Setup - Quick Start (5 Minutos)

## O que foi mudado?

Os componentes **Documents.jsx** e **Songs.jsx** agora usam **Supabase** diretamente em vez de APIs Vercel.

### Componentes atualizados:
- ✅ `src/components/Documents.jsx` - Agora conecta ao Supabase
- ✅ `src/components/Songs.jsx` - Agora conecta ao Supabase
- ✅ `src/lib/supabase.js` - Cliente já existe e está correto

### Sem mudanças em:
- ✅ Aba "Tiragem de Faltas" (totalmente intacta)
- ✅ Layout geral
- ✅ Design tático militar

---

## ⚡ Executar Agora (3 passos)

### 1️⃣ Copiar variáveis de ambiente

Se você não tem `.env.local` na raiz do projeto, crie com:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

Como encontrar essas variáveis:
1. Acesse https://supabase.com
2. Clique em seu projeto
3. Settings > API
4. Copie `Project URL` e `anon public` key

### 2️⃣ Executar Script SQL no Supabase

1. No Supabase, vá para **SQL Editor**
2. Clique **New Query**
3. Abra o arquivo: `sql/setup-supabase.sql`
4. Copie TODO o conteúdo
5. Cola no editor do Supabase
6. Clique **Run** (ou Ctrl+Enter)

✅ Você deve ver mensagens de sucesso para tabelas e políticas.

### 3️⃣ Testar Localmente

```bash
npm run dev
```

1. Abra http://localhost:5173
2. Navegue para **DOCUMENTOS** e **CANÇÕES**
3. Ambas devem carregar SEM erro 500
4. Teste adicionar uma canção:
   - Clique "+ ADICIONAR CANÇÃO"
   - Preencha: Título, Categoria, Letra
   - Clique "Adicionar"
   - A canção deve aparecer

---

## 🔍 Campos das Tabelas

### Documentos
- `title` - Nome do documento
- `description` - Descrição (opcional)
- `file_url` - Link do arquivo (preenchido automaticamente)
- `category` - Uma de: Ordens do Dia, Escalas, Regulamentos, Comunicados, Instruções, Documentos Gerais
- `created_at` - Data de criação (automática)

### Canções
- `title` - Nome da canção
- `artist` - Artista (padrão: CFC 2026)
- `lyrics` - Letra da canção
- `category` - Uma de: Canções do Exército, Canções do CFC, Hinos, Canções de Marcha, Canções Motivacionais
- `created_at` - Data de criação (automática)

---

## 📋 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Erro 500 na aba | Verifique variáveis de ambiente (.env.local) |
| "Table not found" | Execute o script SQL completo do `sql/setup-supabase.sql` |
| Não consegue adicionar canção | Verifique RLS policies no Supabase (devem permitir insert) |
| Dados não aparecem | Verifique que executou o script SQL e que há dados na tabela |
| CORS error | Reinicie `npm run dev` e limpe cache do navegador |

---

## ✅ Checklist Final

- [ ] Variáveis de ambiente (.env.local) definidas
- [ ] Script SQL executado no Supabase
- [ ] Tabelas aparecem em Supabase > Tables
- [ ] npm run build funciona sem erros
- [ ] npm run dev abre sem erro
- [ ] Abas Documentos e Canções carregam
- [ ] Consegue adicionar uma canção
- [ ] Consegue buscar/filtrar
- [ ] Consegue deletar

---

## 🎯 Próximo Passo: Deploy

Quando tudo estiver funcionando localmente:

1. Vá para seu projeto **Vercel**
2. **Settings > Environment Variables**
3. Adicione as 2 mesmas variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Redeploy**

---

## 💡 Dicas

- **Upload de Documentos**: O upload usa Storage do Supabase. Certifique-se que o bucket "documents" existe (público)
- **RLS Policies**: Estão configuradas para permitir acesso público. Se precisa de segurança, altere no Supabase
- **Backup**: Configure no Supabase > Database > Backups para proteger dados

---

✨ **Pronto para usar!** Se algo não funcionar, revise a seção Troubleshooting.
