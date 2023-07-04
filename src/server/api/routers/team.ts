import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getOwnTeam: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teams.findMany({
      where: { Members: { some: { userId: Number(ctx.session.user.id) } } },
      include: {
        Projects: { include: { Category: true } },
        Members: { include: { User: true } },
        TeamSubjects: { include: { Subject: true } },
      },
    });
  }),
});
