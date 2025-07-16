import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { Session } from "next-auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Resend],
  callbacks: {
    session: ({ session }: { session: Session }) => ({
      ...session,
      user: {
        ...session.user,
        id: session.user?.id || "",
        firstName: session.user?.firstName || "",
        lastName: session.user?.lastName || "",
      },
    }),
  },
})