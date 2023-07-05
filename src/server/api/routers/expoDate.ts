import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const expoDateRouter = createTRPCRouter({
  getActive: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.expoDate.findFirst({ where: { isActive: 1 } });
  }),
});
