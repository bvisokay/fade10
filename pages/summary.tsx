import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import { Typography } from "@mui/material"

// styles
import { Highlight } from "../styles/GlobalComponents"

const Summary = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        <Highlight color1="darkBlue" color2="dodgerBlue" style={{ padding: "0" }}>
          Summary
        </Highlight>
      </Typography>
      <hr />
    </>
  )
}
export default Summary

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}
