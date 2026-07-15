# RetratoFit IA

Acompanhamento de evolução física por foto, com análise automática por IA e um harness de confiabilidade (failover entre modelos, verificação de resposta e retry).

Em vez de só guardar fotos lado a lado, o RetratoFit IA analisa cada foto e gera um resumo de evolução: o que mudou desde a última captura, quais regiões mostraram mudança visível e um nível de confiança da análise.

## Como funciona

1. A pessoa tira uma foto pelo app (câmera do próprio celular, direto no navegador).
2. A foto é enviada pro backend e guardada no Supabase Storage.
3. O backend chama um modelo de IA (Gemini como primário, com modelo reserva em caso de falha) pra analisar a foto no contexto do histórico da pessoa.
4. A resposta passa por um verificador de schema antes de chegar no usuário — se o modelo primário falhar ou responder fora do esperado, o sistema tenta automaticamente o próximo modelo da lista, sem o usuário perceber.
5. O resultado aparece na timeline, junto com as fotos anteriores.

## Stack

**Backend**
- Node.js + Express (ESM)
- Prisma + PostgreSQL (Supabase)
- Redis (memória de contexto entre análises)
- Zod (validação de schema das respostas da IA)
- Gemini como modelo de análise
- Clerk (autenticação)

**Frontend**
- React + TypeScript + Vite
- Mobile-first, pensado pra uso via navegador no Android
- Captura de foto nativa via MediaDevices API (`getUserMedia`)

## Estrutura do projeto

```
retratofit-ia/
  backend/
    src/
      config/       # variáveis de ambiente, conexão Supabase e Redis
      harness/       # failover entre modelos, verificação, retry, guardrails, logging
      routes/         # rotas HTTP
      controllers/     # camada de entrada das requisições
      services/          # regras de negócio (análise, upload de foto)
      prisma/              # schema do banco
      middlewares/           # auth (Clerk) e tratamento de erro
      server.js
    package.json

  frontend/
    src/
      components/    # CameraCapture, Timeline, InsightCard
      pages/           # Onboarding, Capture, Timeline
      hooks/            # useCamera, useAnalysis
      services/          # api.ts (chamadas ao backend)
      types/              # interfaces espelhando o schema Prisma
      App.tsx
    package.json

  docker-compose.yml
  README.md
```

## Pré-requisitos

- Node.js 18 ou superior
- Docker e Docker Compose
- Conta no [Supabase](https://supabase.com) (banco Postgres e storage de fotos)
- Conta no [Clerk](https://clerk.com) (autenticação)
- Chave de API do [Gemini](https://ai.google.dev)

## Como rodar localmente

### 1. Subir a infraestrutura (Postgres e Redis)

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # preencher com suas chaves
npm install
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # preencher VITE_CLERK_PUBLISHABLE_KEY
npm install
npm run dev
```

O frontend sobe por padrão em `http://localhost:5173` e o backend em `http://localhost:3000` (ajustar conforme configuração local).

## Variáveis de ambiente

**backend/.env**

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres (pooler, porta 6543) |
| `DIRECT_URL` | Connection string direta do Postgres, usada nas migrations (porta 5432) |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Service key do Supabase (uso no backend, nunca exposta no frontend) |
| `REDIS_URL` | Connection string do Redis |
| `GEMINI_API_KEY` | Chave de API do Gemini |
| `CLERK_SECRET_KEY` | Secret key do Clerk |

**frontend/.env**

| Variável | Descrição |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable key do Clerk |

## O harness de análise

O módulo `backend/src/harness/` existe pra garantir que uma falha de um modelo de IA não vire uma falha visível pro usuário:

- **`models.js`** define a ordem de prioridade dos modelos (primário e reservas).
- **`index.js`** percorre essa lista chamando cada modelo até uma resposta passar na verificação.
- **`verifier.js`** valida, com Zod, se a resposta tem o formato e a consistência esperados antes de aceitar.
- **`retry.js`** reexecuta uma chamada com falha até um limite antes de passar pro próximo modelo.
- **`guardrails.js`** garante que a IA nunca dê diagnóstico clínico ou números de composição corporal como fato, só como estimativa relativa entre fotos.
- **`memory.js`** guarda no Redis o resumo da última análise de cada pessoa, usado como contexto na próxima.
- **`logger.js`** registra qual modelo respondeu, tempo de resposta e se houve fallback, útil pra decidir depois se vale trocar o modelo primário.

## Roadmap

- [ ] Notificação/resumo periódico de evolução
- [ ] Exportar timeline em PDF
- [ ] Comparação lado a lado entre duas datas específicas

## Aviso

As análises geradas pela IA são estimativas relativas de evolução entre fotos, não medições clínicas nem diagnóstico médico.
