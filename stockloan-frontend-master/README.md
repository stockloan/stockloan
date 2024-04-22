# Stockloan React Boilerplate

## 배포 환경

- 운영 Server : 103.244.108.181
- Docker를 사용하여 무중단 배포환경으로 구성
- 운영 Server에서 기동 시 루트 경로의 deploy.sh 실행

## Features

This repository is 🔋 battery packed with:

- ⚡️ Next.js 12
- ⚛️ React 18
- ✨ TypeScript
- 💨 Tailwind CSS 3 — Configured with CSS Variables to extend the **primary** color
- 💎 Pre-built Components — Components that will **automatically adapt** with your brand color, [check here for the demo](https://tsnext-tw.thcl.dev/components)
- 🃏 Jest — Configured for unit testing
- 📈 Absolute Import and Path Alias — Import components using `@/` prefix
- 📏 ESLint — Find and fix problems in your code, also will **auto sort** your imports
- 💖 Prettier — Format your code consistently
- 🐶 Husky & Lint Staged — Run scripts on your staged files before they are committed
- 🤖 Conventional Commit Lint — Make sure you & your teammates follow conventional commit
- ⏰ Standard Version Changelog — Generate your changelog using `yarn release`
- 👷 Github Actions — Lint your code on PR
- 🚘 Automatic Branch and Issue Autolink — Branch will be automatically created on issue **assign**, and auto linked on PR
- 🔥 Snippets — A collection of useful snippets
- 👀 Default Open Graph — Awesome open graph generated using [og](https://github.com/theodorusclarence/og), fork it and deploy!
- 🗺 Site Map — Automatically generate sitemap.xml
- 📦 Expansion Pack — Easily install common libraries, additional components, and configs

See the 👉 [feature details and changelog](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter/blob/main/CHANGELOG.md) 👈 for more.

You can also check all of the **details and demos** on my blog post:

- [One-stop Starter to Maximize Efficiency on Next.js & Tailwind CSS Projects](https://theodorusclarence.com/blog/one-stop-starter)

## Getting Started

### 1. Deploying to Vercel:

1. Instructions

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftheodorusclarence%2Fts-nextjs-tailwind-starter)

### 2. Install dependencies

It is encouraged to use **yarn** so the husky hooks can work properly.

```bash
yarn install
```

### 3. Run the development server

You can start the server using this command:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying `src/pages/index.tsx`.

### 4. Change defaults

There are some things you need to change including title, urls, favicons, etc.

Find all comments with !STARTERCONF, then follow the guide.

### 5. Tech Stack Reference

- React JavaScript Library [documentation](https://reactjs.org/docs/getting-started.html)
- NextJS React Framework [documentation](https://nextjs.org/docs)
- Axios http client [documentation](https://axios-http.com/)
- Lodash utility library [documentation](https://lodash.com/docs/4.17.15)
- React Hook Form [documentation](https://react-hook-form.com/get-started)
- Tailwind Css utility library [documentation](https://tailwindcss.com/)
- Yup object schema validation [documentation](https://github.com/jquense/yup) 
- Date Fns date utility library [documentation](https://date-fns.org/)

### 5. Usage Examples

- React Hook Form, Yup - index.tsx - Home Page
- Axios - utils/axios, ./src/api/example.ts
- React Query - ./src/pages/posts.tsx
