# ⚡ QUICK REFERENCE - CFC 2026 ATUALIZADO

## 🚀 COMEÇAR AGORA

### Local
```bash
cd "c:\Users\desktop\Documents\CFC 2026\cfc-26"
npm install
npm run dev
# Abrir: http://localhost:5173
```

### Produção (Vercel)
```bash
npm install
npm run build
git push origin main
# Vercel faz deploy automático
```

---

## 📂 ESTRUTURA RÁPIDA

```
📁 cfc-26/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── Header.jsx          ← Menu nav
│   │   ├── Documents.jsx       ← Docs
│   │   ├── Songs.jsx           ← Canções
│   │   ├── Banner.jsx
│   │   ├── StudentTable.jsx
│   │   └── ... (mais)
│   ├── App.jsx                 ← Rotas aqui
│   ├── main.jsx
│   └── 📁 styles/
├── 📁 api/
│   ├── documents.js            ← API docs
│   ├── songs.js                ← API canções
│   └── students.js             ← Alunos
├── 📁 public/
│   ├── icons.svg
│   └── favicon.svg
├── 📁 dist/                    ← Build output
├── .env.local                  ← Variáveis locais
├── .gitignore
├── package.json
├── vite.config.js
└── 📁 docs/ (NEW)
    ├── SISTEMA_ATUALIZADO.md
    ├── SETUP_VERCEL.md
    ├── DEPLOYMENT_STATUS.md
    ├── VISUAL_GUIDE.md
    ├── ANTES_DEPOIS.md
    └── CHANGELOG_ATUALIZACAO.md
```

---

## 🎯 3 SEÇÕES PRINCIPAIS

### 1️⃣ TIRAGEM DE FALTAS (Original)
```
URL: / (padrão)
Tab: "Tiragem de Faltas"

Funcionalidades:
- Ver 40 alunos
- Mudar status (6 opções)
- Buscar por número/nome
- Exportar PDF
- Sync em tempo real

Banco: Supabase
```

### 2️⃣ DOCUMENTOS (Novo)
```
URL: /documentos
Tab: "Documentos"

Funcionalidades:
- Upload de PDFs
- 6 categorias
- Buscar por nome
- Filtrar por categoria
- Download/Visualizar
- Deletar

Banco: Vercel Postgres
```

### 3️⃣ CANÇÕES MILITARES (Novo)
```
URL: /cancoes
Tab: "Canções"

Funcionalidades:
- Adicionar canção
- 5 categorias
- Buscar por nome
- Filtrar por categoria
- Ver letras
- Deletar

Banco: Vercel Postgres
```

---

## 🔧 VARIÁVEIS DE AMBIENTE

### .env.local (Local)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Vercel Dashboard
```
POSTGRES_URLCONNECT=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
POSTGRES_HOST=db.xxx.supabase.co
POSTGRES_PASSWORD=***
POSTGRES_USER=postgres
POSTGRES_DATABASE=postgres
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## 📊 BANCO DE DADOS

### Tabelas Existentes
```sql
-- Supabase
students (id, numero, nome, status)
resets (id, reset_date)
CFC (id, created_at)

-- Vercel Postgres
documents (id, name, category, file_data, mime_type, date)
songs (id, title, category, lyrics, date)
```

### SQL Setup (Execute no Vercel Postgres)
```sql
-- Documentos
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  file_data BYTEA,
  mime_type TEXT DEFAULT 'application/pdf',
  date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Canções
CREATE TABLE songs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## 🎨 CORES

```css
/* Militar */
#0b1208 - Fundo escuro
#11190f - Cards/Surface
#d5b45a - Dourado accent
#f7f3df - Texto bege

/* Status */
CFC: #48bb78 (Verde)
ESV: #3b82f6 (Azul)
SSV: #facc15 (Amarelo)
SDE: #f97316 (Laranja)
DSP: #6b7280 (Cinza)
FLT: #ef4444 (Vermelho)
```

---

## 🚦 COMANDOS PRINCIPAIS

### Dev
```bash
npm run dev              # Local dev server
npm run build            # Build produção
npm run preview          # Ver build localmente
npm run lint             # Verificar código
```

### Git
```bash
git add .
git commit -m "Message"
git push origin main     # Deploy automático via Vercel
```

### Deploy
```bash
vercel deploy            # Deploy manual
vercel deploy --prod     # Deploy produção
```

---

## 🔌 ENDPOINTS API

### Documentos
```
GET  /api/documents                 # Lista todos
POST /api/documents                 # Upload novo
DELETE /api/documents?id=X          # Deletar
GET /api/documents?download&id=X    # Download PDF
```

### Canções
```
GET  /api/songs                     # Lista todas
POST /api/songs                     # Criar nova
DELETE /api/songs?id=X              # Deletar
```

### Alunos (Supabase)
```
GET    /alunos                      # Via Supabase
PATCH  /alunos/:id                  # Atualizar status
```

---

## ✅ CHECKLIST DEPLOY

- [ ] Clonar repo
- [ ] `npm install`
- [ ] Criar `.env.local`
- [ ] Adicionar Supabase credentials
- [ ] Testar `npm run dev`
- [ ] `npm run build` (sem erros)
- [ ] Conectar Vercel
- [ ] Criar Vercel Postgres DB
- [ ] Adicionar env vars no Vercel
- [ ] Git push
- [ ] Verificar build em Vercel
- [ ] Testar em produção
- [ ] Compartilhar link

---

## 📱 RESPONSIVIDADE

```
Desktop  (1200px+)  → Full layout
Tablet   (720px+)   → Adjusted
Mobile   (<720px)   → Stacked
```

Testado em:
- ✅ Chrome, Firefox, Safari
- ✅ iPhone, iPad, Android
- ✅ Desktop Windows/Mac/Linux

---

## 🐛 TROUBLESHOOTING

| Problema | Solução |
|----------|---------|
| Build falha | `npm install` novamente |
| DB não conecta | Verificar .env.local |
| Upload falha | Max 5MB, PDF only |
| Supabase vazio | Inserir alunos com SQL |
| Deploy falha | Verificar env vars Vercel |
| Página branca | F12 → Console para erros |

---

## 📞 SUPORTE RÁPIDO

### Local Development
```bash
# Limpar cache
rm -r node_modules
npm install

# Novo build
npm run build

# Ver logs
npm run build -- --mode development
```

### Vercel Dashboard
- Deployments → Ver logs
- Settings → Environment Variables
- Analytics → Performance metrics

### Database
- Supabase → SQL Editor
- Vercel → Database connections
- Check logs em /api/xxx

---

## 🎯 RECURSOS

- 📄 README.md - Documentação geral
- 📋 SISTEMA_ATUALIZADO.md - Overview completo
- 🚀 SETUP_VERCEL.md - Passo a passo deploy
- 🎨 VISUAL_GUIDE.md - UI/UX detalhado
- 📊 DEPLOYMENT_STATUS.md - Status técnico
- ↔️ ANTES_DEPOIS.md - Mudanças realizadas
- 📝 CHANGELOG_ATUALIZACAO.md - Log de mudanças

---

## 🔐 SEGURANÇA

- ✅ HTTPS automático (Vercel)
- ✅ CORS configurado
- ✅ Validação de upload
- ✅ Sem exposição de chaves
- ✅ RLS policies
- ✅ Rate limiting (Vercel)

---

## 📈 PERFORMANCE

```
Build:     681ms
Bundle:    797 kB (242.72 kB gzip)
LCP:       < 3s
FCP:       < 1s
TTI:       < 4s
```

Otimizado com:
- Code splitting (Vite)
- Image optimization
- CSS scoped
- Lazy loading
- Compression

---

## 🏁 PRÓXIMOS PASSOS

1. **Setup Local**
   - Clonar
   - Instalar
   - .env.local
   - npm run dev

2. **Teste Funcional**
   - Ir em cada aba
   - Testar upload
   - Testar busca
   - Exportar PDF

3. **Deploy**
   - GitHub push
   - Vercel build
   - Test em produção
   - Share link

4. **Maintenance**
   - Monitor performance
   - Check logs
   - Backups regulares

---

## 📞 REFERÊNCIAS

**Stack**:
- React: https://react.dev
- Vite: https://vitejs.dev
- Styled Components: https://styled-components.com
- Supabase: https://supabase.com
- Vercel: https://vercel.com

**Documentação**:
- Todos os guias acima
- `npm` documentation
- Git best practices

---

**Versão**: 1.0.0  
**Status**: ✅ Pronto  
**Last Updated**: 2026-06-20

🎖️ **Sistema CFC 2026 - Pronto para Usar** 🎖️
