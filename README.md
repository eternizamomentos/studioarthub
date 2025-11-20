This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

=====================================================================================================================
# **🛡 Painel Executivo — Protocolo Oficial de Recuperação & Restauração**

**Versão do documento:** 1.0
**Status:** Ativo e obrigatório
**Projeto:** Studio Art Hub
**Ambiente alvo:** Local, Desenvolvimento e Deploy Futuro

---

## 📌 Objetivo

Este documento define o **método oficial e padronizado** de restauração do Painel Executivo, garantindo:

* Estabilidade contínua
* Integridade visual e funcional
* Prevenção de perda acidental
* Recuperação rápida em caso de falhas
* Processo unificado, claro e seguro

Este protocolo deve ser seguido rigorosamente **toda vez que ocorrer erro estrutural, visual, de build ou compilação**.

---

## 🚨 Quando usar este procedimento?

Execute este protocolo se alguma das situações abaixo ocorrer:

| Tipo de Problema              | Exemplos Comuns                           |
| ----------------------------- | ----------------------------------------- |
| Estilo sumiu                  | Layout sem fontes, sem cores, tudo "cru"  |
| Tela branca                   | Página renderiza mas sem conteúdo         |
| Next.js não inicia            | Erros de build ou `Invalid source map`    |
| Tailwind não funciona         | Classes não aplicam ou compilador quebra  |
| Erros após atualização        | `npm install`, `npm update`, upgrades etc |
| Arquivos alterados por engano | configs, CSS ou layout                    |

---

## 🔒 Regra global

NUNCA tente corrigir o erro *adivinhando soluções*
NUNCA atualize dependências sem planejamento
NUNCA modifique arquivos base sem backup

---

## ♻ Fluxo Oficial de Recuperação (100% Garantido)

Siga exatamente na ordem — não pule passos.

### 1️⃣ Feche tudo

* Finalize servidor
* Feche VS Code se necessário
* Feche todas as abas do terminal

### 2️⃣ Acesse o diretório correto

```bash
cd apps/executive-panel
```

### 3️⃣ Apague a pasta de build compilada (`.next`)

#### Windows (PowerShell)

```powershell
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
```

#### Caso prefira interface

Excluir manualmente:
`apps/executive-panel/.next`

---

### 4️⃣ Restaure o arquivo crítico `globals.css`

* Local correto:

```
apps/executive-panel/app/globals.css
```

* Substitua pelo arquivo original salvo em backup preferencialmente em:

```
apps/executive-panel/.safeguard/globals.css
```

Se não existir backup: **NÃO continue — peça suporte.**

---

### 5️⃣ Reinicialize o ambiente

```bash
npm run dev
```

Se abrir e estilizar corretamente → Sucesso.

Se ainda falhar, prossiga.

---

## 🧩 Etapas Avançadas (somente se necessário)

### 6️⃣ Reinstalar dependências (apenas como último recurso)

```bash
cd C:\Users\Desktop\studioarthub
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
npm install
npm run dev
```

---

## 🧪 Checklist final pós-restauração

| Item                                                          | OK? |
| ------------------------------------------------------------- | --- |
| Painel abre em [http://localhost:3001](http://localhost:3001) | ✔   |
| Cores, sombras, fontes e gradientes estão ativos              | ✔   |
| Nenhum erro em terminal ou console                            | ✔   |
| Build inicia sem warnings graves                              | ✔   |
| Tailwind aplicando classes normalmente                        | ✔   |

Se qualquer item for ❌, **não continuar desenvolvendo.**

---

## 🔁 Frequência recomendada de auditoria

| Período                          | Ação                                 |
| -------------------------------- | ------------------------------------ |
| 1x por semana                    | Abrir painel e validar funcionamento |
| Antes de cada feature            | Criar backup                         |
| Antes de qualquer instalação NPM | Criar snapshot                       |

---

## 📦 Recomendações de Backup

Crie ao menos um dos seguintes:

| Tipo        | Ferramenta              | Frequência |
| ----------- | ----------------------- | ---------- |
| Git offsite | GitHub privado          | Diária     |
| Nuvem       | Google Drive / OneDrive | Semanal    |
| Offline     | HD externo              | Mensal     |

---

## 📌 Observações finais

Este painel não deve seguir o ciclo de atualização constante. Sua estabilidade é um ativo operacional estratégico do Studio Art Hub.

> "Softwares podem evoluir, mas sistemas críticos nunca devem quebrar."