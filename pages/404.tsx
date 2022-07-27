import Link from "next/link"
import styled from "@emotion/styled"
import Head from "next/head"
import { Display, WrapperNarrow } from "../styles/GlobalComponents"

const FlexParent = styled.div`
  display: flex;
  height: 400px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //border: 2px solid purple;
`

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>Not Found | Simple Car Cost</title>
      </Head>
      <WrapperNarrow>
        <FlexParent>
          <Display>Not Found</Display>
          <div>
            Head back to the <Link href="/">homepage</Link> for a fresh start.
          </div>
        </FlexParent>
      </WrapperNarrow>
    </>
  )
}
export default NotFoundPage
