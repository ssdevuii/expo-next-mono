import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getOwnProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: { id: Number(ctx.session.user.id) },
      include: {
        Role: true,
      },
    });
  }),

  likeRemain: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirstOrThrow({
      where: { id: Number(ctx.session.user.id) },
    });

    const likeLimitByRole = await ctx.prisma.likesLimit.findFirstOrThrow({
      where: { id: user?.roleId },
    });

    const likeCount = await ctx.prisma.likes.findMany({
      where: { userId: user?.id, ExpoDate: { isActive: 1 } },
    });

    return likeLimitByRole.amount - likeCount.length;
  }),
});
