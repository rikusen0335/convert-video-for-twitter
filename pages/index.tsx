import { Box, Button, CircularProgress, CircularProgressLabel, Flex, Heading, HStack, Input, Link, Text, Textarea, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import useFFmpeg from '../hooks/useFFmpeg'
import { signIn, signOut, useSession } from "next-auth/react"
import { getToken } from 'next-auth/jwt'
import { useToast } from '@chakra-ui/react'

import styles from "../styles/Home.module.css"

interface Twit {
  id: string
  text: string
}

const Top: NextPage = () => {
  const { progress, videoURL, handleFileChange } = useFFmpeg()
  const fileRef = useRef<HTMLInputElement>(null)

  const { status, data } = useSession()

  const [statuses, setStatuses] = useState<object>()
  const [content, setContent] = useState<string>("")
  const [submitState, setSubmitState] = useState<"loading" | "data">("data")

  const toast = useToast()

  async function handleTweet() {
    if (!videoURL) return

    setSubmitState("loading")

    const file = await fetch(videoURL).then(r => r.blob());

    const body = new FormData()
    body.set("content", content)
    body.set("file", file)

    try {
      const res = await fetch('/api/twitter/tweet', {
        method: 'POST',
        body: body,
      }).then((res) => res.json())

      setStatuses(res)
      if (res.tweetUrl) {
        toast({
          title: 'ツイートが完了しました！',
          description: <span><Link color="blue.400" href={res.tweetUrl} isExternal>このリンク</Link>から見てみましょう！</span>,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }
    } catch (e) {
      toast({
        title: 'ツイートに失敗しました',
        description: <span>なんらかの理由によりツイートに失敗しました。<Link color="blue.400" href="https://twitter.com/RikuS3n" isExternal>@RikuS3n</Link>までコンタクトをお願いします。</span>,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    } finally {
      setSubmitState("data")
    }
  }

  return (
    <div>
      <Head>
        <title>Twitter用動画コンバーター</title>
        <meta name="description" content="うんちぶりぶり" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <VStack mb={10}>
          <Heading>Twitter用動画コンバーター</Heading>
          <Text>このサイトは、サーバーのリソースを使う代わりに、あなたのブラウザ上でエンコードを行います。</Text>
        </VStack>

        <VStack mb={12}>
          {status !== "authenticated" && <VStack>
            <Text>Twitterに投稿したい場合は、動画をダウンロードするか、ログインしてください。</Text>
            <Text><b>ログインしてから</b>動画を変換すると、スムーズにツイートできます。</Text>
            <Button colorScheme="blue" onClick={() => signIn("twitter")}>Twitterにログインする</Button>
          </VStack>}
          {status === "authenticated" && <VStack>
            <p>{data.user?.name} としてログイン中</p>
            <Button onClick={() => signOut()}>Twitterからログアウト</Button>
            {videoURL && <VStack>
              <Textarea mt={4} onChange={(e) => setContent(e.target.value)} />
              <Button
                colorScheme="blue"
                onClick={() => handleTweet()}
                isLoading={submitState === "loading"}
                loadingText="ツイート中..."
              >現在の動画をツイートする</Button>
            </VStack>}
          </VStack>}
        </VStack>

        <input
          type="file"
          name="file"
          id="file"
          hidden
          onChange={handleFileChange}
          ref={fileRef}
        />
        <Button mb={8} colorScheme="green" onClick={() => fileRef.current?.click()}>動画ファイルを選択</Button>
        {/* <Button onClick={() => postTweet()}>ツイートする</Button> */}

        {progress &&
          <HStack gap={12}>
            <CircularProgress value={Math.round((progress?.ratio ?? 0) * 100)} size='230px'>
              <CircularProgressLabel>
                <Heading fontSize="xl">変換率</Heading>
                <Heading fontSize="3xl">{Math.round((progress?.ratio ?? 0) * 100)} %</Heading>
              </CircularProgressLabel>
            </CircularProgress>
            <CircularProgress color='orange.400' value={100} size='230px'>
              <CircularProgressLabel>
                <Heading fontSize="xl">動画の長さ</Heading>
                <Heading  fontSize="3xl">{progress?.duration}{progress?.duration && "秒"}</Heading>
              </CircularProgressLabel>
            </CircularProgress>
            <CircularProgress color='green.300' size='230px' isIndeterminate>
              <CircularProgressLabel>
                <Heading fontSize="xl">変換済み時間</Heading>
                <Heading fontSize="3xl">{progress?.time}{progress?.time && "秒"}</Heading>
              </CircularProgressLabel>
            </CircularProgress>
          </HStack>
        }

          {videoURL && <Flex flexDirection="column" alignItems="center" justifyContent="center" mt={12}>
            <Heading fontSize="xl" mb={3}>プレビュー</Heading>
            <video
              src={videoURL}
              width={"1024px"}
              height={"576px"}
              controls
            />
          </Flex>}
      </main>
    </div>
  )
}

export default Top
