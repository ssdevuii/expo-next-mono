import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const lecturerRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.lecturers.findMany();
  }),

  getSubjectsByLecturerId: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.lecturers.findFirst({
        where: { id: input },
        include: { Subject: true, User: true },
      });
    }),
});
