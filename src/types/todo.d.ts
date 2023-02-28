import { z } from "zod";

export const todoInput = z
  .string({
    require_error: "Describe your todo",
  })
  .min(1)
  .max(50);
