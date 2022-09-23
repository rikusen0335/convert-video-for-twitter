import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { TwitterApi } from 'twitter-api-v2'
import Twitter from 'twitter-lite'

const fuga = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) return res.status(401).json({
    status: 'token is null',
  })

  const apiSecrets = {
    subdomain: 'api',
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: token.twitter.accessToken,
    access_token_secret: token.twitter.refreshToken
  }

  console.log(apiSecrets)

  const client = new Twitter(apiSecrets);

  const body = JSON.parse(req.body);
  const { query } = body;

  try {
    const results = await client.get('search/tweets', {
      q: query
    });
    return res.status(200).json({
      status: 'Ok',
      data: results.statuses
    });
  } catch(e) {
    console.log(e)
    return res.status(400).json({
      status: e.message
    });
  }
}

export default fuga
