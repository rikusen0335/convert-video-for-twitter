import '../styles/globals.css'
import type { AppProps } from 'next/app'
import type { Session } from "next-auth";
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return <SessionProvider session={pageProps.session}>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  </SessionProvider>
}

export default MyApp
