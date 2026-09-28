import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions)
// exportar as rotas
// ele vai usar essas rotas pra quando a gente for criar usuário , fazer login
export { handler as GET, handler as POST }