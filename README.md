# vite-plugin-nestjs

> A Vite plugin for NestJS

## Installation

```bash
npm install --save-dev vite-plugin-nestjs
```

## Usage

```js
// vite.config.ts
import { defineConfig } from "vite";
import nestjs from "vite-plugin-nestjs";

export default defineConfig({ plugins: [nestjs()] });
// src/main.ts
// ...
// Must export a default function that returns a NestJS app
export default async function createApp() {
  const app = await NestFactory.create(AppModule);
  return app;
}
// To get typings for import.meta.env, add the following to tsconfig.json
// "types": ["vite/client"]
// Alternatively, process.env.NODE_ENV === "production"
if (import.meta.env.PROD)
  createApp().then((app) => app.listen(process.env.PORT || 8080));
```

## Options

```ts
type Options = {
  input?: string; // Path to the NestJS entry file, defaults to "src/main.ts"
  adapter?: "express" | "fastify"; // The adapter you are using, defaults to "express"
};
```
