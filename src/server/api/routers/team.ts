import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        subjectAndLecturer: z.array(
          z.object({ lecturerId: z.number(), subjectId: z.number() })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.teams.create({
        data: {
          name: input.name,
          TeamSubjects: { createMany: { data: input.subjectAndLecturer } },
          Members: {
            create: { userId: Number(ctx.session.user.id), status: "Leader" },
          },
        },
      });
    }),

  deleteTeam: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.teams.delete({
        where: { id: input },
        include: { Members: true, Projects: true, TeamSubjects: true },
      });
    }),
});
