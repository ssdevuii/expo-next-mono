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
      orderBy: { id: "desc" },
    });
  }),

  getById: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.teams.findFirst({
      where: { id: input },
      include: {
        Projects: { include: { Category: true } },
        Members: { include: { User: true } },
        TeamSubjects: { include: { Subject: true } },
      },
      orderBy: { id: "desc" },
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

  getInvitation: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.members.findMany({
      where: { userId: Number(ctx.session.user.id), status: "Invited" },
      include: { Team: true },
    });
  }),

  getInvitationCount: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.members.count({
      where: { userId: Number(ctx.session.user.id), status: "Invited" },
    });
  }),

  getInvitedMemberByTeamId: protectedProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.prisma.members.findMany({
        where: { teamId: input },
        include: { User: true },
      });
    }),

  sendInvitation: protectedProcedure
    .input(z.object({ teamId: z.number(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { email: input.email },
        select: { id: true },
      });

      return ctx.prisma.members.create({
        data: { teamId: input.teamId, userId: user.id, status: "Invited" },
      });
    }),

  cancleInvitation: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.members.delete({
        where: { id: input },
      });
    }),
});
