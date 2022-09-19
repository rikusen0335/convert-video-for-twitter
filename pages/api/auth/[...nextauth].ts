import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import TwitterProvider from "next-auth/providers/twitter";

const options: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read tweet.write offline.access",
        },
      },
    }),
  ],
  // pages: {
  //   signIn: '/',
  // },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token[account.provider] = {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
        }
      }

      return token
    },
  },
  // debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)
