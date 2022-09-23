import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

import { EUploadMimeType, TwitterApi } from 'twitter-api-v2'

import formidable from "formidable";
import fs from "fs/promises"

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

  const fields: Record<string, unknown> = {}

  try {
    const form = formidable({ filename: _ => 'video.mp4', uploadDir: "./" });
    form
      .on('field', (field, value) => {
        console.log(field, value);
        fields[field] = value;
      })
      .on('file', async function (_name, oldFile) {
        console.log('Uploaded ' + oldFile.newFilename);

        const { content } = fields as { content: string }

        const buffer = await fs.readFile(oldFile.filepath)

        const profile = await rwClient.currentUser()
        const uniqueName = profile.screen_name

        const mediaId = await rwClient.v1.uploadMedia(buffer, { mimeType: EUploadMimeType.Mp4 })
        const createdTweet = await rwClient.v1.tweet(content, { media_ids: [mediaId] })

        return res.status(200).json({
          status: 'Ok',
          tweetUrl: `https://twitter.com/${uniqueName}/status/${createdTweet.id_str}`,
        })
      })


    form.parse(req)
  } catch (e: unknown) {
    console.log(e)
    return res.status(400).json({
      status: e,
    })
  }
}

export default fuga
