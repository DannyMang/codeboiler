import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

console.log('NextAuth configuration is being loaded');

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.error('Missing GitHub OAuth credentials');
  throw new Error('Missing GitHub OAuth credentials');
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email }) {
      console.log('Sign in attempt:', { user, account, profile, email });
      return true;
    },
  },
});