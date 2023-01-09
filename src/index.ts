import type { Plugin } from "vite";

const PACKAGE_NAME = "vite-plugin-nestjs";

export type Options = {
  /** Path to the NestJS entrypoint, defaults to src/main */
  input?: string;
  /** The http adapter you are using, defaults to express */
  adapter?: "express" | "fastify";
};

export default function nestjs({
  input = "src/main.ts",
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
        optimizeDeps: {
          exclude: [
            "cache-manager",
            "class-transformer",
            "class-validator",
            "@nestjs/microservices",
            "@nestjs/websockets",
            "@nestjs/platform-express",
          ],
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
