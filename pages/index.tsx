import { Button, CircularProgress, CircularProgressLabel, Heading, HStack, Input } from '@chakra-ui/react'
import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import useFFmpeg from '../hooks/useFFmpeg'
import { signIn, signOut, useSession } from "next-auth/react"
import styles from '../styles/Home.module.css'

import fs from 'fs'
import { getToken } from 'next-auth/jwt'
import { useRouter } from 'next/router'

interface Twit {
  id: string
  text: string
}

const Home: NextPage = ({ token }) => {
  const { progress, videoURL, handleFileChange } = useFFmpeg()
  const fileRef = useRef<HTMLInputElement>(null)

  const { status, data } = useSession()

  const [statuses, setStatuses] = useState<Twit[]>([])
  const session = useSession()
  const router = useRouter()

  async function handleOnSearchSubmit() {
    const results = await fetch('/api/twitter/search', {
      method: 'POST'
    }).then((res) => res.json())

    setStatuses(results.data)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {status === "authenticated" && <p>{data.user?.name} としてログイン中</p>}
        {status !== "authenticated" && <Button onClick={() => signIn("twitter")}>Sign in with Twitter</Button>}
        {status === "authenticated" && <Button onClick={() => signOut()}>Signout</Button>}
        <Button onClick={() => handleOnSearchSubmit()}>Tweet</Button>
        <input
          type="file"
          name="file"
          id="file"
          hidden
          onChange={handleFileChange}
          ref={fileRef}
        />
        <Button onClick={() => fileRef.current?.click()}>動画ファイルを選択</Button>
        {/* <Button onClick={() => postTweet()}>ツイートする</Button> */}
        <HStack>
          <CircularProgress value={Math.round(progress?.ratio * 100)} size='200px'>
            <CircularProgressLabel>
              <Heading fontSize="2xl">読み込み率</Heading>
              <Heading fontSize="2xl">{Math.round(progress?.ratio * 100)}{progress?.ratio && " %"}</Heading>
            </CircularProgressLabel>
          </CircularProgress>
          <CircularProgress color='green.300' value={100} size='200px'>
            <CircularProgressLabel>
              <Heading fontSize="2xl">動画の長さ</Heading>
              <Heading>{progress?.duration}{progress?.duration && "秒"}</Heading>
            </CircularProgressLabel>
          </CircularProgress>
          <CircularProgress size='200px' isIndeterminate>
            <CircularProgressLabel>
              <Heading fontSize="2xl">読込済み時間</Heading>
              <Heading>{progress?.time}{progress?.time && "秒"}</Heading>
            </CircularProgressLabel>
          </CircularProgress>
        </HStack>
      </main>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  const token = await getToken({ req, raw: true })

  return {
    props: {
      token
    }
  }
}

export default Home
