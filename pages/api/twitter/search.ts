import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { TwitterApi } from 'twitter-api-v2'

const fuga = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) return res.status(401).json({
    status: 'token is null',
  })

  const userClient = new TwitterApi({
    appKey: process.env.TWITTER_CLIENT_ID,
    appSecret: process.env.TWITTER_CLIENT_SECRET,
    accessToken: token.twitter.accessToken,
    accessSecret: token.twitter.refreshToken,
  })

  const rwClient = userClient.readWrite

  try {
    console.log(await rwClient.currentUserV2())
    const { id } = await rwClient.v1.tweet('twitter-api-v2 is awesome!');

    return res.status(200).json({
      status: 'Ok',
      data: id,
    })
  } catch (e: unknown) {
    return res.status(400).json({
      status: (e as Error).message,
    })
  }
}

export default fuga
