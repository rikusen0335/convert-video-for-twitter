import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import TwitterProvider from "next-auth/providers/twitter";

const options: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY!!,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET!!,
      // version: "2.0",
      authorization: {
        params: {
          scope: "users.read tweet.read tweet.write",
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
          accessToken: account.oauth_token,
          refreshToken: account.oauth_token_secret,
        }
      }

      return token
    },
  },
  // debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

const nextAuth = (req: NextApiRequest, res: NextApiResponse) =>
NextAuth(req, res, options)

export default nextAuth
