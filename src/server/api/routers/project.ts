import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getLatest: publicProcedure
    .input(z.number().optional())
    .query(({ ctx, input }) => {
      return ctx.prisma.projects.findMany({
        where: {
          Team: { NOT: { TeamSubjects: { none: {} } } },
        },
        include: {
          Category: true,
          Team: { include: { TeamSubjects: { include: { Subject: true } } } },
        },
        orderBy: { id: "desc" },
        take: input ?? 10,
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

  search: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        year: z.number().optional(),
        subjectId: z.number().optional(),
      })
    )
    .query(({ ctx, input }) => {
      const where: {
        name?: {
          contains: string | undefined;
        };
        Team?: {
          TeamSubjects: {
            some: {
              subjectId: number | undefined;
            };
          };
        };
        ExpoDate?: {
          year: number | undefined;
        };
      } = {
        name: { contains: input.name },
        Team: {
          TeamSubjects: { some: { subjectId: input.subjectId } },
        },
        ExpoDate: { year: input.year },
      };

      if (!input.name) delete where.name;
      if (!input.subjectId) delete where.Team;
      if (!input.year) delete where.ExpoDate;

      return ctx.prisma.projects.findMany({
        where,

        include: {
          Category: true,
          Team: { include: { TeamSubjects: { include: { Subject: true } } } },
        },
        take: 100,
        orderBy: { id: "desc" },
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
            // Members: { include: { User: true } },
            Members: {include: { User: true }},
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

  create: protectedProcedure
    .input(
      z.object({
        demoLink: z.string(),
        gdriveLink: z.string(),
        name: z.string(),
        categoryId: z.number(),
        teamId: z.number(),
        description: z.string(),
        expoDateId: z.number(),
        poster: z.string(),
        videoLink: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.projects.create({
        data: {
          ...input,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        demoLink: z.string(),
        gdriveLink: z.string(),
        name: z.string(),
        categoryId: z.number(),
        description: z.string(),
        poster: z.string(),
        videoLink: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.poster === "" && input.gdriveLink === "") {
        return ctx.prisma.projects.update({
          where: { id: input.id },
          data: {
            name: input.name,
            categoryId: input.categoryId,
            description: input.description,
            demoLink: input.demoLink,
            videoLink: input.videoLink,
          },
        });
      } else {
        return ctx.prisma.projects.update({
          where: { id: input.id },
          data: {
            name: input.name,
            categoryId: input.categoryId,
            description: input.description,
            gdriveLink: input.gdriveLink,
            demoLink: input.demoLink,
            poster: input.poster,
            videoLink: input.videoLink,
          },
        });
      }
    }),

  getBySDGId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.projects.findMany({
      include: {
        Category: true,
        Team: { include: { TeamSubjects: { include: { Subject: true } } } },
      },
      where: { categoryId: input ?? undefined },
    });
  }),
  getLikedBy: publicProcedure
  .input(z.number())
  .query(async ({ ctx, input }) => {
    const likes = await ctx.prisma.likes.findMany({
      where: { projectId: input },
    });

    const validLikes = [];

    for (const like of likes) {
      const user = await ctx.prisma.user.findUnique({
        where: { id: like.userId },
      });

      if (user) {
        validLikes.push({ ...like, User: user });
      }
    }

    return validLikes;
  }),
});
