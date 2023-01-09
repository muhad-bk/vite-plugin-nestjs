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

export default defineConfig({
  plugins: [nestjs()],
});
```

## Options

```ts
type Options = {
  input: string; // Path to the NestJS entry file
  adapter: "express" | "fastify"; // The adapter you are using
};
```
