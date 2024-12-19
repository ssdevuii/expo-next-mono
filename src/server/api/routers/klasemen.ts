import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const klasemenRouter = createTRPCRouter({
  getBestTen: publicProcedure
    .input(
      z
        .object({
          id: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      let id = input?.id;

      if (id == undefined) {
        const expo = await ctx.prisma.expoDate.findFirst({
          where: { isActive: 1 },
        });
        id = expo?.id;
      }

      const expoDate = await ctx.prisma.expoDate.findFirst({
        where: {
          id,
        },
      });

      return ctx.prisma.projects.findMany({
        orderBy: { Likes: { _count: "desc" } },

        include: {
          Team: true,
          _count: { select: { Likes: true } },
          Category: true,
        },

        where: { expoDateId: expoDate?.id ?? undefined },
        take: 10,
      });
    }),
});
