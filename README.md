Resumo Completo do Projeto
🏦 JAND Bank - Sistema Bancário com Microserviços
Um sistema bancário completo com arquitetura de microserviços, frontend moderno em Next.js e backend em Node.js/Express com MongoDB.

📋 Visão Geral
JAND Bank é uma aplicação de banco digital que oferece funcionalidades essenciais como:

✅ Registro e login de usuários com autenticação JWT
✅ Gestão de contas com saldo em tempo real
✅ Depósitos e saques
✅ Transferências entre contas
✅ Extrato detalhado de transações
✅ Interface profissional e responsiva
Arquitetura:

🎨 Frontend: Next.js 16 (App Router, TypeScript, Tailwind CSS)
🔧 Backend: Node.js + Express (ES Modules)
💾 Banco de Dados: MongoDB (Mongoose)
🐳 Containerização: Docker Compose
🔐 Autenticação: JWT (JSON Web Tokens)
🚀 Tecnologias Utilizadas
Frontend (bank-system)
Next.js 16 com Turbopack (dev) — renderização rápida
React 19 — componentes interativos
TypeScript — type safety
Tailwind CSS — estilização utilitária
localStorage — persistência de token JWT
Backend (bank-microservice)
Node.js 20 + Express — servidor RESTful
Mongoose — ODM para MongoDB
JWT — autenticação segura
CORS — integração frontend/backend
dotenv — configuração via variáveis de ambiente
Infraestrutura
Docker & Docker Compose — orquestração de containers
MongoDB — banco de dados NoSQL
Volume Persistente — dados do Mongo preservados entre restarts

projeto-04-12-25/
├── bank-microservice/          # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── controllers/        # Lógica de negócio (users, accounts)
│   │   │   ├── userController.js
│   │   │   └── accountController.js
│   │   ├── models/             # Esquemas MongoDB
│   │   │   ├── User.js
│   │   │   ├── Account.js
│   │   │   └── Transaction.js
│   │   ├── routes/             # Endpoints da API
│   │   │   ├── userRoutes.js
│   │   │   └── accountRoutes.js
│   │   ├── middleware/         # JWT auth middleware
│   │   │   └── auth.js
│   │   └── server.js           # Bootstrap da app
│   ├── .env                    # Variáveis de ambiente
│   ├── package.json
│   └── Dockerfile
│
├── bank-system/                # Frontend (Next.js)
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Home page (JAND Bank)
│   │   ├── login/page.tsx      # Autenticação + logout
│   │   ├── register/page.tsx   # Registro de novo usuário
│   │   ├── dashboard/page.tsx  # Painel do cliente (saldo, ops)
│   │   ├── transfer/page.tsx   # Transferências
│   │   ├── transactions/page.tsx # Extrato completo
│   │   ├── forgot-password/page.tsx
│   │   └── globals.css
│   ├── src/lib/
│   │   └── api.ts              # Cliente HTTP centralizado
│   ├── public/                 # Assets estáticos
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── Dockerfile
│
├── docker-compose.yml          # Orquestração dos serviços
└── README.md

🔑 Funcionalidades Principais
1️⃣ Autenticação
Registro com validação de email duplicado
Login com JWT (token armazenado em localStorage)
Logout com limpeza de token
Middleware de proteção nas rotas autenticadas
2️⃣ Gestão de Conta
Criação automática de conta ao registrar (com número único)
Saldo inicial: R$ 0,00
Visualização em tempo real do saldo no dashboard
3️⃣ Operações Bancárias
Depósito: adiciona saldo à conta
Saque: deduz saldo (com validação de fundos suficientes)
Transferência: move saldo entre contas (para outra conta existente)
Registro automático de cada operação como transação
4️⃣ Extrato de Transações
Lista completa de histórico (depósitos, saques, transferências)
Formatação de datas e valores em BRL
Filtros por tipo de transação (opcional)
Paginação (opcional)
5️⃣ Interface Profissional
Home: Apresentação do banco com CTA (Entrar / Criar Conta)
Login: Formulário centralizado com estado autenticado, logout e redirecionamento
Dashboard: Layout em dois painéis (ações rápidas + tabela de transações)
Responsividade: Mobile-first design com Tailwind CSS
🛠️ Setup e Execução
Pré-requisitos
Docker e Docker Compose instalados
Git (para clonar o repositório)
(Opcional) Node.js 20+ para dev local sem Docker
1. Clonar o Repositório

git clone https://github.com/jandsonanjos/Project-bank-with-api-microservices.git
cd Project-bank-with-api-microservices

2. Configurar Variáveis de Ambiente
Backend (.env)

MONGO_URL=mongodb://projeto-04-12-25_mongo_1:27017/bank
JWT_SECRET=MINHA_CHAVE_SECRETA
PORT=4000

Frontend: Usa http://localhost:4000 como URL da API (veja api.ts)

3. Iniciar os Serviços

# Subir todos os containers (mongo, api, frontend)
docker-compose up --build -d

# Verificar status
docker-compose ps

# Ver logs da API
docker logs bank-api

# Ver logs do frontend
docker logs next-frontend

4. Acessar a Aplicação
Frontend: http://localhost:3000
API: http://localhost:4000
MongoDB: localhost:27017 (interno)

📡 Endpoints da API
Usuários

POST   /users/register       Registrar novo usuário
POST   /users/login          Fazer login (retorna token JWT)

GET    /account              Obter dados da conta autenticada
POST   /account/deposit      Depositar valor
POST   /account/withdraw     Sacar valor
POST   /account/transfer     Transferir para outra conta
GET    /account/transactions Listar histórico de transações

Autenticação: Incluir header Authorization: Bearer <token_jwt> em requisições autenticadas.

🔐 Segurança
✅ Senhas: Tratadas com Mongoose (sem hash visível no código, usar bcrypt em prod)
✅ JWT: Assinado com process.env.JWT_SECRET
✅ Validação: Email único por usuário, validação de saldo
✅ CORS: Habilitado para frontend em dev
⚠️ Prod: Considere adicionar rate limiting, HTTPS, bcrypt para senhas

🐛 Problemas Resolvidos Durante Desenvolvimento
JWT inválido: Corrigido alinhamento de JWT_SECRET entre signing e validação
Erro E11000 (Mongo): Adicionada validação de email duplicado antes de insert
Transações multi-documento: Removidas (não suportadas em MongoDB standalone) — operações sequenciais simples
ContainerConfig (Docker): Resolvido removendo containers corrompidos e recriando imagens
Field value obrigatório: Corrigido nome de campo em Transaction schema

📝 Melhorias Futuras
 Implementar bcrypt para hash de senhas
 Adicionar autenticação global no layout (app/layout.tsx)
 Toasts/notificações elegantes para feedback
 Máscaras de entrada (CPF, valores monetários)
 Paginação no extrato de transações
 Rate limiting e CSRF protection
 Testes unitários e E2E
 Configurar MongoDB como Replica Set para suportar transações multi-documento
 Deploy em produção (Vercel, Render, AWS, etc.)

 # Dev local (sem Docker)
cd bank-system
npm run dev          # Frontend em http://localhost:3000

cd ../bank-microservice
npm start            # Backend em http://localhost:4000

# Docker
docker-compose up -d              # Subir em background
docker-compose down               # Parar (preserva volumes)
docker-compose down -v            # Parar e apagar volumes (cuidado!)
docker logs -f bank-api           # Ver logs em tempo real
docker exec -it next-frontend sh  # Shell dentro do container

icença
Este projeto é de código aberto para fins educacionais.

✨ Status do Projeto
✅ Funcional: Todos os endpoints testados e operacionais
✅ Dockerizado: Pronto para deploy
✅ Versionado: Repositório Git com histórico completo
🚀 Pronto para Produção: Com ajustes de segurança e performance

 Autor
jandsonanjos — GitHub
