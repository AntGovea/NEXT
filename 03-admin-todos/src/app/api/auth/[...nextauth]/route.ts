import NextAuth, { NextAuthOptions } from 'next-auth'
import GitHubProvider  from 'next-auth/providers/github'


export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
        }),
        // ...add more providers here
    ],
}


let test= { clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? ''}
            console.log('----------------------------TEST-----------------------------')
            console.log(test)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };