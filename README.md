
# OPT Authentication

Este projeto foi desenvolvido com o objetivo de explorar e solidificar conhecimentos sobre autenticação utilizando códigos OTP (One-Time Password). Ele combina as tecnologias Next.js no frontend e Fastify no backend para criar uma solução moderna, segura e eficiente de autenticação.


## Funcionalidades

- Autenticação utilizando OPT
- Atualização do token de autenticação por meio de refresh-token
- Painel para controle de acesso


## Stack utilizada

**Front-end:** nextjs, tailwind, react-query, ky, shadcnui, playwright

**Back-end:** fastify, prisma, resend, zod, vitest, supertest

## Pré-requisito

- nodejs
- pnpm
- docker
- docker-compose

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`DATABASE_URL`

`JWT_SECRET`

`ENV_TYPE`

`STAGING_API_TOKEN`

`NEXT_PUBLIC_API_URL`

`RESEND_API_KEY`

`MAIL_PROVIDER`

## Rodando localmente

Instale as dependências

```bash
  pnpm install
```

Inicie o servidor

```bash
  pnpm run dev
```


## Rodando os testes

API

```bas
cd apps/api
pnpm run test:e2e
```

WEB

```bas
cd apps/api
pnpm run dev

cd apps/web
pnpm run test:e2e
```

## Autores

- [@pedrolgcs](https://www.github.com/pedrolgcs)


## Licença

[MIT](https://choosealicense.com/licenses/mit/)


## Feedback

Se você tiver algum feedback, por favor nos deixe saber por meio de pedro.lg.cs@gmail.com

