import type { Plugin } from "vite";

const PACKAGE_NAME = "vite-plugin-ssr";

export type Options = { input?: string; adapter?: "express" | "fastify" };

export default function nestjs({
  input = "src/main",
  adapter = "express",
}: Options = {}): Plugin {
  return {
    name: PACKAGE_NAME,
    config() {
      return {
        build: {
          ssr: true,
          rollupOptions: {
            input,
          },
        },
      };
    },
    configureServer(server) {
      let previousApp: any;
      server.middlewares.use(async (req, res) => {
        const module = await server.ssrLoadModule(input);
        const app = await module.default();
        if (!app.isInitialized) {
          if (previousApp) await previousApp.close();
          await app.init();
          previousApp = app;
        }
        const instance = app.getHttpAdapter().getInstance();
        if (adapter === "express") instance(req, res);
        else if (adapter === "fastify") {
          await instance.ready();
          instance.routing(req, res);
        }
      });
    },
  };
}
