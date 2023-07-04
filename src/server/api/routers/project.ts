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
    return ctx.prisma.projects.findFirst({
      where: { id: input },
      include: {
        Category: true,
        _count: { select: { Likes: true } },
        Team: {
          include: {
            Members: { include: { User: true } },
            TeamSubjects: {
              include: {
                Subject: true,
                Lecturer: { include: { User: true } },
              },
            },
          },
        },
      },
    });
  }),

  likeProjectById: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const expoDate = await ctx.prisma.expoDate.findFirstOrThrow({
        where: { isActive: 1 },
      });

      return ctx.prisma.likes.create({
        data: {
          projectId: input,
          userId: Number(ctx.session.user.id),
          expoDateId: expoDate.id,
        },
      });
    }),

  isProjectLiked: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.likes.findFirst({
        where: { projectId: input, userId: Number(ctx.session.user.id) },
      });
    }),

  // TODO
  create: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.projects.findFirst({ where: { id: input } });
  }),
});
