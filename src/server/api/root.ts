import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { projectRouter } from "./routers/project";
import { userRouter } from "./routers/user";
import { klasemenRouter } from "./routers/klasemen";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  project: projectRouter,
  klasemen: klasemenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
