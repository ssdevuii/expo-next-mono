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

  getPopular: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.projects.findMany({
      take: 5,
      orderBy: { Likes: { _count: "desc" } },
      select: {
        _count: { select: { Likes: true } },
        Team: true,
        name: true,
        gdriveLink: true,
        id: true,
      },
    });
  }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.projects.findFirst({ where: { id: input } });
  }),
});
