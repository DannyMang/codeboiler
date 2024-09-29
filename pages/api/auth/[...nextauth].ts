import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

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
    async jwt({ token, account }) {
      // When the user signs in for the first time, add access_token to the token object
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // Include access_token in the session object
      session.accessToken = token.accessToken;
      return session;
    },

    async signIn({ user, account, profile, email }) {
      console.log('Sign in attempt:', { user, account, profile, email });
      return true;
    },
  },
});
