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
          year: z.number().optional(),
          semester: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const expoDate = await ctx.prisma.expoDate.findFirst({
        where: {
          id: input?.year ?? undefined,
          semester: input?.semester ?? undefined,
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
