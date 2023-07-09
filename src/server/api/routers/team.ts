import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getOwnTeam: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.teams.findMany({
      where: {
        Members: {
          some: {
            userId: Number(ctx.session.user.id),
            status: { not: "Invited" },
          },
        },
      },
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

  editTeam: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        subjectAndLecturer: z.array(
          z.object({ lecturerId: z.number(), subjectId: z.number() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.subjectAndLecturer.length > 0) {
        await ctx.prisma.teamSubjects.deleteMany({
          where: { teamId: input.id },
        });
        return await ctx.prisma.teams.update({
          where: { id: input.id },
          data: {
            name: input.name,
            TeamSubjects: { createMany: { data: input.subjectAndLecturer } },
          },
        });
      } else {
        return await ctx.prisma.teams.update({
          where: { id: input.id },
          data: {
            name: input.name,
          },
        });
      }
    }),

  deleteTeam: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.projects.findFirst({
        where: { teamId: input },
      });

      if (project) {
        await ctx.prisma.likes.deleteMany({ where: { projectId: project.id } });
        await ctx.prisma.projects.delete({ where: { id: project.id } });
      }
      await ctx.prisma.members.deleteMany({ where: { teamId: input } });
      await ctx.prisma.teamSubjects.deleteMany({ where: { teamId: input } });

      return ctx.prisma.teams.delete({
        where: { id: input },
      });
    }),

  getInvitation: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.members.findMany({
      where: { userId: Number(ctx.session.user.id), status: "Invited" },
      include: { Team: { include: { Projects: true } } },
    });
  }),

  getInvitationCount: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.members.count({
      where: { userId: Number(ctx.session.user.id), status: "Invited" },
    });
  }),

  getInvitedMemberByTeamId: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { id: Number(ctx.session.user.id) },
      });

      const invitations = await ctx.prisma.members.findMany({
        where: {
          teamId: input,
        },
        include: { User: true },
      });

      if (invitations.find((invitation) => invitation.userId == user.id)) {
        return invitations;
      }

      throw new Error("You are not a member of this team");
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

  acceptInvitation: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.members.findFirstOrThrow({
        where: {
          id: input,
          userId: Number(ctx.session.user.id),
          status: "Invited",
        },
      });

      return ctx.prisma.members.update({
        data: { status: "Member" },
        where: { id: input },
      });
    }),
});
