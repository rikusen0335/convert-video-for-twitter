import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { EUploadMimeType, TwitterApi } from 'twitter-api-v2'

import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const fuga = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) return res.status(401).json({
    status: 'token is null',
  })

  const apiSecrets = {
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: token.twitter.accessToken,
    accessSecret: token.twitter.refreshToken,
  }

  const userClient = new TwitterApi(apiSecrets)

  const rwClient = userClient.readWrite

  const form = formidable({});

  const body = JSON.parse(req.body);
  const { file, content } = body;

  try {
    form.parse(req, async function (err, fields, files) {
      if (err) {
        res.statusCode = 500;
        res.json({
          method: req.method,
          error: err
        });
        res.end();
        return;
      }
      const file = files.file;

      console.log(file)

      const mediaId = await rwClient.v1.uploadMedia(Buffer.from(await (file as File).arrayBuffer()), { mimeType: EUploadMimeType.Mp4 })
      const createdTweet = await rwClient.v1.tweet(content, { media_ids: [mediaId] })

      return res.status(200).json({
        status: 'Ok',
        data: createdTweet.id,
      })
    });
  } catch (e: unknown) {
    console.log(e)
    return res.status(400).json({
      status: e,
    })
  }
}

export default fuga
