# Guia de Migração para Supabase - Documentos e Canções

## 🎯 Objetivo
Corrigir a integração das abas "Documentos" e "Canções" para usar Supabase diretamente, eliminando erros 500.

---

## ✅ Verificação Prévia

### 1. Variáveis de Ambiente
Certifique-se de que seu `.env.local` contém:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 2. Cliente Supabase
O arquivo `src/lib/supabase.js` deve estar assim:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set these variables in your local .env files or in Vercel environment settings.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🗄️ Configuração do Supabase

### Passo 1: Execute o Script SQL
1. Acesse seu projeto Supabase em https://supabase.com
2. Vá para **SQL Editor**
3. Crie um novo SQL query
4. Copie o conteúdo de `sql/setup-supabase.sql`
5. Execute o script completo
6. Você verá mensagens de sucesso para cada tabela criada

### Passo 2: Verifique as Tabelas
No Supabase, vá para **Tables** no menu lateral:
- Você deve ver: `documents` e `songs`
- Ambas devem ter as colunas corretas

### Passo 3: Verifique as RLS Policies
Para cada tabela (`documents` e `songs`), verifique:
1. Clique na tabela
2. Vá para **Row Level Security**
3. Você deve ver 4 políticas para cada tabela:
   - ✓ allow read documents
   - ✓ allow insert documents
   - ✓ allow update documents
   - ✓ allow delete documents
   
   (E o equivalente para `songs`)

### Passo 4: Configure o Storage (Opcional, para documentos com arquivos)
Se você quer fazer upload de PDFs:
1. Vá para **Storage** no menu lateral
2. Clique em **Create a new bucket**
3. Nome: `documents`
4. Marque: **Public bucket**
5. Clique **Create bucket**
6. Nas políticas do bucket, certifique-se que:
   - SELECT é públic o
   - INSERT é público
   - DELETE é público

---

## 📝 Estrutura das Tabelas

### Tabela: documents
```sql
id              UUID PRIMARY KEY
title           TEXT (nome do documento)
description     TEXT (descrição opcional)
file_url        TEXT (URL do arquivo no storage)
category        TEXT (categoria do documento)
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

**Categorias permitidas:**
- Ordens do Dia
- Escalas
- Regulamentos
- Comunicados
- Instruções
- Documentos Gerais

### Tabela: songs
```sql
id              UUID PRIMARY KEY
title           TEXT (nome da canção)
artist          TEXT (artista, padrão: CFC 2026)
lyrics          TEXT (letra da canção completa)
audio_url       TEXT (URL do áudio, opcional)
category        TEXT (categoria da canção)
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

**Categorias permitidas:**
- Canções do Exército
- Canções do CFC
- Hinos
- Canções de Marcha
- Canções Motivacionais

---

## 🚀 Mudanças no Código

### Componente: Documents.jsx
**Antes:**
- Usava `/api/documents` (Vercel Postgres)
- Usava nomes de campos: `name`, `date`

**Depois:**
- Usa `supabase.from('documents').select()`
- Usa nomes de campos: `title`, `created_at`, `file_url`
- Upload de arquivos para Storage do Supabase
- Queries com tratamento de erro Supabase

### Componente: Songs.jsx
**Antes:**
- Usava `/api/songs` (Vercel Postgres)
- Usava nomes de campos: `date`

**Depois:**
- Usa `supabase.from('songs').select()`
- Usa nomes de campos: `title`, `created_at`, `lyrics`
- Suporta campo `artist` (padrão: CFC 2026)
- Queries com tratamento de erro Supabase

---

## 🔍 Teste a Integração

### 1. Teste Local
```bash
npm run dev
```
- Acesse http://localhost:5173
- Navegue para abas "Documentos" e "Canções"
- Verifique se carregam sem erro 500

### 2. Teste de Inserção (Canções)
1. Na aba "Canções", clique "+ ADICIONAR CANÇÃO"
2. Preencha:
   - Título: "Hino Nacional"
   - Categoria: "Hinos"
   - Letra: "Ouviram do Ipiranga as margens plácidas..."
3. Clique "Adicionar"
4. Deve aparecer a canção na lista

### 3. Teste de Inserção (Documentos)
1. Na aba "Documentos", clique "+ ADICIONAR PDF"
2. Selecione um arquivo PDF
3. Escolha uma categoria
4. Deve fazer upload e aparecer na lista

### 4. Teste de Busca
- Procure por uma canção/documento que você adicionou
- A busca deve filtrar corretamente

### 5. Teste de Exclusão
- Clique em "🗑️ Deletar" em qualquer item
- Confirme a exclusão
- O item deve desaparecer da lista

---

## ❌ Troubleshooting

### Erro: "401 Unauthorized"
**Causa:** Variáveis de ambiente não definidas ou incorretas
**Solução:**
1. Verifique `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
2. Se em Vercel: Acesse Project Settings > Environment Variables
3. Reinicie o servidor

### Erro: "Table not found"
**Causa:** Script SQL não foi executado
**Solução:**
1. Retorne a sql/setup-supabase.sql
2. Execute no SQL Editor do Supabase
3. Aguarde conclusão

### Erro: "RLS policy violation"
**Causa:** Políticas RLS não permitem acesso
**Solução:**
1. No Supabase, vá para cada tabela (documents/songs)
2. Row Level Security > Verifique se policies estão com `USING (true)`
3. Se não estão, execute o script SQL novamente

### Erro: "Network error when attempting to fetch"
**Causa:** CORS ou URL incorreta
**Solução:**
1. Verifique a URL do Supabase (deve começar com https://)
2. Confirme que não há caracteres especiais na URL
3. Se em produção, adicione variáveis no Vercel

### Dados não aparecem
**Causa:** Sem dados na tabela ou dados antigos
**Solução:**
1. Vá para Supabase > Table Editor
2. Clique em `documents` ou `songs`
3. Verifique se existem linhas
4. Se não houver, tente adicionar um novo item

---

## 📦 Deploy para Vercel

### 1. Configure Environment Variables
1. Acesse seu projeto Vercel
2. Settings > Environment Variables
3. Adicione:
   - `VITE_SUPABASE_URL`: `https://seu-projeto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sua-anon-key`
4. Deploy > Trigger Deploy

### 2. Verifique Logs
1. Em Vercel, vá para Deployments
2. Clique no deployment mais recente
3. Vá para Logs > Function Logs
4. Se houver erros, aparecerão aqui

---

## ✨ Funcionalidades Agora Disponíveis

### Documentos
- ✅ Listar documentos com busca
- ✅ Filtrar por categoria
- ✅ Upload de PDFs (com Storage Supabase)
- ✅ Download de documentos
- ✅ Visualizar PDF no navegador
- ✅ Deletar documentos

### Canções
- ✅ Listar canções com busca
- ✅ Filtrar por categoria
- ✅ Adicionar novas canções
- ✅ Visualizar letra completa
- ✅ Deletar canções
- ✅ Ordenação por data (mais recente primeiro)

---

## 🔒 Segurança

### RLS Policies Ativadas
- Todas as tabelas têm Row Level Security ativado
- Policies permitem leitura e escrita públicas (ideal para uso coletivo)
- Se precisa de acesso restrito, altere as policies no Supabase

### Recomendações
- Mude para RLS restritivo em produção
- Adicione autenticação de usuários
- Configure backup automático no Supabase
- Monitore uso de storage

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Supabase (Logs > Edge Functions)
2. Confirme RLS policies estão ativas
3. Verifique console do navegador (F12) para erros
4. Consulte documentação do Supabase: https://supabase.com/docs

---

## ✅ Checklist de Configuração Final

- [ ] Script SQL executado com sucesso
- [ ] Tabelas `documents` e `songs` existem no Supabase
- [ ] RLS policies estão habilitadas nas tabelas
- [ ] Variáveis de ambiente configuradas (.env.local e Vercel)
- [ ] Componentes Documents.jsx e Songs.jsx importam supabase
- [ ] npm run build executa sem erros
- [ ] Teste local: abas carregam sem erro 500
- [ ] Teste de inserção de canção funciona
- [ ] Teste de busca funciona
- [ ] Teste de exclusão funciona
- [ ] Deploy em Vercel com variáveis definidas

**Status:** ✅ PRONTO PARA PRODUÇÃO

