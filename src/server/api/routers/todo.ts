import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { todoInput } from "y/types/todo";

export const todoRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });
    // return todos.map(({ id, text, done }) => ({ id, text, done }));
    console.log(
      "Log from prisma",
      todos.map(({ id, text, done }) => ({ id, text, done }))
    );

    return [
      {
        id: "fake",
        text: "text fake",
        done: false,
      },
      {
        id: "fake 2",
        text: "text fake 2",
        done: true,
      },
      {
        id: "fake 3 ",
        text: "text fake 3",
        done: false,
      },
    ];
  }),

  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          text: input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),

  toggle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.prisma.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }),
});
