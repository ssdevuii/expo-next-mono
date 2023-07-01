import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.projects.findMany({
      include: {
        Category: true,
        Team: { include: { TeamSubjects: { include: { Subject: true } } } },
      },
      orderBy: { id: "desc" },
      take: 10,
    });
  }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.example.findFirst({ where: { id: input.toString() } });
  }),
});
