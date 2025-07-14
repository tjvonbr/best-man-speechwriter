"use server"

import { prisma } from "@/lib/prisma"
import { userAuthSchema } from "@/lib/validations/auth"

export async function createUser(formData: FormData) {
  try {
    const data = userAuthSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      sex: formData.get("sex"),
    })

    const existingUser = await prisma.user.findFirst({
      where: { email: data.email }
    })

    if (existingUser) {
      return { error: "This user already exists!  Trying to sign in instead!" }
    }

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        sex: data.sex,
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error("Error creating user:", error)
    return { error: "Failed to create user" }
  }
} 