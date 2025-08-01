import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'



export const authOptions: NextAuthOptions = {

    adapter: PrismaAdapter(prisma) as Adapter,


    // Configure one or more authentication providers
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? '',
            clientSecret: process.env.GOOGLE_SECRET ?? '',
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        // ...add more providers here
    ],

    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async signIn({
            user, account, profile, email, credentials }) {
            console.log({ user })
            return true
        },
        async jwt({ token, user, account, profile }) {
            const dbUser = await prisma.user.findUnique({ where: { email: token.email ?? 'no-email' } })
            if (dbUser?.isActive === false) {
                throw Error('usuario no esta activo')
            }
            token.roles = dbUser?.roles ?? ['no-roles']
            token.id = dbUser?.id ?? 'no-uuid'
            return token;
        },
        async session({ session, token, user }) {
            console.log({ token })
            if (session && session.user) {
                session.user.roles = token.roles;
                session.user.id = token.id;
            }
            return session
        },
    }
}


let test = {
    clientId: process.env.GITHUB_ID ?? '',
    clientSecret: process.env.GITHUB_SECRET ?? ''
}
console.log('----------------------------TEST-----------------------------')
console.log(test)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };