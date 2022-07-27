import "../styles/globals.css"
import type { AppProps } from "next/app"
import Layout from "../components/Layout"
import Head from "next/head"
import { SessionProvider } from "next-auth/react"
//import CssBaseline from "@mui/material/CssBaseline"

export const SITENAME = "Fade10"
import { Global } from "@emotion/react"
import { GlobalStyles } from "../styles/globals"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      <SessionProvider session={pageProps.session}>
        {/*  <CssBaseline /> */}
        <Global styles={GlobalStyles} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  )
}

export default MyApp
