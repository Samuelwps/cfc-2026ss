# 📸 GUIA VISUAL - NOVAS SEÇÕES

## INTERFACE GERAL

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎖️ CFC 2026  │ Tiragem de Faltas │ Documentos │ Canções         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Página Atual Renderizada Aqui                           │   │
│  │ (Muda conforme clica no menu)                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ HEADER NAVIGATION

```
┌──────────────────────────────────────────────────────────────────┐
│ [🎖️ Logo] CFC 2026  │  [Tiragem de Faltas ✓] │ [Documentos] │ [Canções]  │
├──────────────────────────────────────────────────────────────────┤
                                 
Estilo Militar:
- Border dourada inferior (#d5b45a)
- Fundo verde escuro (#11190f)
- Texto bege claro (#f7f3df)
- Logo: assets/logocfc2026.png

Responsividade:
- Desktop: Todos items em linha
- Tablet: Flex wrap
- Mobile: Stack vertical
```

---

## 2️⃣ SEÇÃO DOCUMENTOS

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ DOCUMENTOS                                                   │
│ Central de documentos militares...                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────────────────────┐    ┌──────────────┐  │
│ │ Buscar documentos...             │    │ + ADICIONAR  │  │
│ ├──────────────────────────────────┤    └──────────────┘  │
│ │ Todos │ Ordens do Dia │ Escalas │ Regulamentos ...│    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────┐   │
│ │ 📄 DOCUMENTO 1  │  │ 📄 DOCUMENTO 2  │  │ 📄 DOC 3│   │
│ │                 │  │                 │  │         │   │
│ │ Categoria:      │  │ Categoria:      │  │ Categ:  │   │
│ │ Ordens do Dia   │  │ Escalas         │  │ Regulam │   │
│ │                 │  │                 │  │         │   │
│ │ Data: 20/06/26  │  │ Data: 19/06/26  │  │ Data:   │   │
│ │                 │  │                 │  │ 18/06   │   │
│ │ [Download] [...│  │ [Download] [...│  │ [Down.] │   │
│ │ 🗑️ Deletar      │  │ 🗑️ Deletar      │  │🗑️ Del   │   │
│ └─────────────────┘  └─────────────────┘  └─────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Design dos Cards

```
╔═════════════════════════════════════════════════════╗
║ 📄 NOME DO DOCUMENTO                               ║
╠═════════════════════════════════════════════════════╣
║                                                     ║
║ Categoria: Ordens do Dia                           ║
║ Data: 20 de junho de 2026                          ║
║                                                     ║
╠═════════════════════════════════════════════════════╣
║ [📥 Download] [👁️ Visualizar]                     ║
║       [🗑️ Deletar documento]                      ║
╚═════════════════════════════════════════════════════╝

Cores:
- Border: #d5b45a (Dourado)
- Background: rgba(17, 25, 15, 0.8)
- Hover: Sobe 4px, brilho aumenta
```

### Funcionalidades Detalhadas

```
UPLOAD DE PDF:
1. Clica "+ ADICIONAR PDF"
2. Seleciona arquivo (max 5MB, PDF only)
3. Sistema pede categoria via prompt
4. Arquivo é convertido em base64
5. Enviado para /api/documents
6. Armazenado em Vercel Postgres
7. Atualiza lista automaticamente

BUSCA E FILTRO:
- Input busca por nome do arquivo
- Tags de categoria clicáveis
- Combina busca + filtro
- Atualiza em tempo real

DOWNLOAD:
- Clica "Download" 
- Faz request em /api/documents?download&id=X
- Browser baixa arquivo

DELETAR:
- Clica "Deletar"
- Confirma com dialog
- Remove do banco
- Lista atualiza
```

---

## 3️⃣ SEÇÃO CANÇÕES MILITARES

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ CANÇÕES MILITARES                                            │
│ Acervo de canções militares, hinos e marchas...             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────────────────────┐    ┌──────────────┐  │
│ │ Buscar canções...                │    │ + ADICIONAR  │  │
│ ├──────────────────────────────────┤    └──────────────┘  │
│ │Todos│ Exército│ CFC│ Hinos│Marcha│ Motivacional        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────┐  ┌─────────────────────┐         │
│ │ 🎵 MARCHA DOS CABOS │  │ 🎵 HINO DO CFC      │         │
│ │                     │  │                     │         │
│ │ Categoria:          │  │ Categoria:          │         │
│ │ Canções de Marcha   │  │ Hinos               │         │
│ │                     │  │                     │         │
│ │ Data: 20/06/26      │  │ Data: 19/06/26      │         │
│ │                     │  │                     │         │
│ │ ┌─────────────────┐ │  │ ┌─────────────────┐ │         │
│ │ │ Avante Cabos... │ │  │ │ Oh! Soldados... │ │         │
│ │ │ Marchar sempre  │ │  │ │ Que a honra     │ │         │
│ │ │ De frente sim...│ │  │ │ E o dever...    │ │         │
│ │ │ (preview...)    │ │  │ │ (preview...)    │ │         │
│ │ └─────────────────┘ │  │ └─────────────────┘ │         │
│ │                     │  │                     │         │
│ │ [Letra Completa] [🗑️ Deletar]              │         │
│ │         [Deletar canção]                  │         │
│ └─────────────────────┘  └─────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Modal de Adicionar Canção

```
╔═══════════════════════════════════════════════════════╗
║ Adicionar Canção                                      ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║ Título da Canção                                      ║
║ ┌─────────────────────────────────────────────────┐  ║
║ │ Ex: Marcha dos Cabos                            │  ║
║ └─────────────────────────────────────────────────┘  ║
║                                                       ║
║ Categoria                                             ║
║ ┌──────────────────────────────────────────────────┐  ║
║ │ Canções do Exército                              │  ║
║ └──────────────────────────────────────────────────┘  ║
║                                                       ║
║ Letra                                                 ║
║ ┌──────────────────────────────────────────────────┐  ║
║ │                                                  │  ║
║ │ Digite aqui a letra da canção...                │  ║
║ │                                                  │  ║
║ │                                                  │  ║
║ │                                                  │  ║
║ └──────────────────────────────────────────────────┘  ║
║                                                       ║
║ [Cancelar]                        [Adicionar]       ║
╚═══════════════════════════════════════════════════════╝
```

### Design dos Cards Canções

```
╔═════════════════════════════════════════════════════╗
║ 🎵 TÍTULO DA CANÇÃO                                 ║
╠═════════════════════════════════════════════════════╣
║                                                     ║
║ Categoria: Canções do Exército                      ║
║ Data: 20 de junho de 2026                          ║
║                                                     ║
╠═════════════════════════════════════════════════════╣
║ ┌─────────────────────────────────────────────┐   ║
║ │ Avante, soldados, vamos marchar...          │   ║
║ │ Pela honra e pelo dever nacional...         │   ║
║ │ Com coragem no coração...                   ║
║ │ (preview - scroll para ver mais)            │   ║
║ └─────────────────────────────────────────────┘   ║
║                                                     ║
║ [📄 Letra Completa] [🗑️ Deletar]                ║
║       [Deletar canção]                          ║
╚═════════════════════════════════════════════════════╝

Cores:
- Border: #d5b45a
- Background: rgba(17, 25, 15, 0.8)
- Preview background: rgba(213, 180, 90, 0.1)
- Border left: 3px solid #d5b45a
```

---

## 4️⃣ SEÇÃO TIRAGEM DE FALTAS (Mantida Igual)

```
┌────────────────────────────────────────────────────┐
│ 🎖️ TIRAGEM DE FALTAS                              │
│ Controle rápido e visível para conferência...     │
│                           [Banner Turma da direita]│
├────────────────────────────────────────────────────┤
│ Data atual                          [GERAR PDF]   │
│ 20 de junho de 2026                                │
│                                                    │
│ Total Alunos │ CFC │ ESV │ SSV │ SDE │ DSP │ FLT │
│     40       │ 35  │  2  │  1  │  1  │  0  │  1  │
│                                                    │
├────────────────────────────────────────────────────┤
│ [Buscar por número ou nome...]                     │
│                                                    │
│ Nº │ Nome de Guerra  │ Status                      │
│───┼─────────────────┼──────────────                │
│ 01│ WALLACE         │ [CFC ▼]                     │
│ 02│ GUEDES          │ [ESV ▼]                     │
│ 03│ OLIVEIRA        │ [CFC ▼]                     │
│ ...                                                │
│                                                    │
│ Atualização automática a cada 5 segundos          │
│ Última atualização: 15:45:30                      │
└────────────────────────────────────────────────────┘
```

---

## 🎨 PALETA DE CORES

### Backgrounds
- `#0b1208` - Fundo principal (verde muito escuro)
- `#11190f` - Cards e superfícies

### Accents
- `#d5b45a` - Dourado militar (bordas, highlights)
- `#e5d474` - Dourado mais claro (hover)

### Texto
- `#f7f3df` - Texto principal (bege claro)
- `rgba(247, 243, 223, 0.78)` - Texto secundário
- `rgba(247, 243, 223, 0.5)` - Placeholder

### Status (Mantidos)
```
CFC = #48bb78 (Verde)
ESV = #3b82f6 (Azul)
SSV = #facc15 (Amarelo)
SDE = #f97316 (Laranja)
DSP = #6b7280 (Cinza)
FLT = #ef4444 (Vermelho)
```

---

## 📱 RESPONSIVIDADE

### Desktop (1200px+)
```
┌─────────────────────────────────┐
│ Grid full width                 │
│ Múltiplas colunas               │
│ Todos elementos lado a lado     │
└─────────────────────────────────┘
```

### Tablet (720px+)
```
┌──────────────────┐
│ Grid adaptado    │
│ 2 colunas        │
│ Elementos ajust. │
└──────────────────┘
```

### Mobile (<720px)
```
┌────┐
│ 1  │
│ co │
│ lu │
│ na │
│    │
│ St │
│ ack│
│    │
│ ve │
│ rt │
└────┘
```

---

## ✨ ANIMAÇÕES E TRANSITIONS

```
Hover nos Cards:
- Transform: translateY(-4px)
- Box-shadow: aumenta
- Border color: mais brilhante

Botões:
- Hover: translateY(-1px)
- Background: mais opaco
- Transition: 0.2s ease

Navegação:
- Clique suave
- Renderização condicional (sem reload)
```

---

## 🚀 FLUXOS DE USUÁRIO

### Flow 1: Adicionar Documento

```
Usuário
   ↓
Clica "+ ADICIONAR PDF"
   ↓
Seleciona arquivo (max 5MB)
   ↓
Escolhe categoria (dialog)
   ↓
Sistema converte para base64
   ↓
Envia POST /api/documents
   ↓
Banco armazena
   ↓
Lista atualiza (sucesso!)
   ↓
Notificação de sucesso
```

### Flow 2: Cadastrar Canção

```
Usuário
   ↓
Clica "+ ADICIONAR CANÇÃO"
   ↓
Modal abre
   ↓
Preenche: Título, Categoria, Letra
   ↓
Clica "Adicionar"
   ↓
POST /api/songs
   ↓
Banco armazena
   ↓
Modal fecha
   ↓
Lista atualiza com nova canção
   ↓
Notificação sucesso
```

### Flow 3: Mudar Status (Existente)

```
Usuário
   ↓
Clica select dropdown
   ↓
Escolhe novo status
   ↓
UI atualiza imediatamente
   ↓
PATCH /supabase students
   ↓
Banco atualiza
   ↓
Realtime sync para outros navegadores
   ↓
PDF pode ser gerado com novo status
```

---

## 📊 EXEMPLO DE DADOS

### Documentos
```json
{
  "id": 1,
  "name": "Ordem do Dia 15 - Junho 2026.pdf",
  "category": "Ordens do Dia",
  "date": "2026-06-20T10:30:00Z"
}
```

### Canções
```json
{
  "id": 1,
  "title": "Marcha dos Cabos",
  "category": "Canções de Marcha",
  "lyrics": "Avante cabos vamos marchar...",
  "date": "2026-06-20T10:30:00Z"
}
```

### Alunos
```json
{
  "id": 1,
  "numero": 1,
  "nome": "WALLACE",
  "status": "CFC"
}
```

---

**Última atualização**: 2026-06-20  
**Status**: ✅ Pronto para uso
