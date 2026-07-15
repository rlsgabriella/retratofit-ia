# RetratofitIA

Acompanhe sua evolução corporal com inteligência artificial. Tire fotos, receba análises geradas por IA e acompanhe seu progresso ao longo do tempo.

## Stack

- **Frontend**: React 19 + TypeScript + Vite (PWA)
- **Backend**: Node.js + Express + Prisma
- **Banco de dados**: PostgreSQL (via Supabase ou local)
- **Cache**: Redis
- **Auth**: Clerk
- **Storage**: Supabase Storage
- **IA**: Google Gemini

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) (para Postgres e Redis locais)
- Conta no [Clerk](https://clerk.com/) (gratuita)
- Conta no [Supabase](https://supabase.com/) (gratuita)
- Chave da API do [Google Gemini](https://aistudio.google.com/)

---

## Configuração local

### 1. Infraestrutura (Postgres + Redis)

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Preencha o .env com suas credenciais
npm install
npx prisma migrate dev --name init
npm run dev
```

Variáveis necessárias em `backend/.env`:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres (ex: `postgresql://postgres:postgres@localhost:5432/retratofit`) |
| `DIRECT_URL` | Igual a `DATABASE_URL` para uso local |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key do Supabase |
| `REDIS_URL` | `redis://localhost:6379` |
| `GEMINI_API_KEY` | Chave da API do Google Gemini |
| `CLERK_SECRET_KEY` | Secret key do Clerk (`sk_test_...`) |
| `PORT` | `3000` |

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Preencha VITE_CLERK_PUBLISHABLE_KEY
npm install
npm run dev
```

Variáveis necessárias em `frontend/.env`:

| Variável | Descrição |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable key do Clerk (`pk_test_...`) |

O frontend roda em `http://localhost:5173` e faz proxy das rotas `/api/*` para o backend em `localhost:3000`.

---

## Supabase Storage

Crie um bucket público chamado `fotos` no painel do Supabase em **Storage → New bucket**.

---

## Clerk

No painel do Clerk, configure:
- **Allowed origins**: `http://localhost:5173`
- **JWT Templates** (opcional para customização de claims)

---

## Scripts disponíveis

### Backend
| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com hot-reload (nodemon) |
| `npm start` | Inicia em produção |
| `npx prisma studio` | Interface visual do banco |

### Frontend
| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Linting com oxlint |
