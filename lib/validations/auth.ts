import * as z from "zod";

export const userAuthSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  sex: z.enum(["male", "female"]),
});

export const loginAuthSchema = z.object({
  email: z.string().email(),
});