import { useState } from "react"
import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"

// types
import { DataPointType, FetchAllDataResultType, StreakObject } from "../lib/types"

// util functions
import { fetchAllData } from "../lib/util"
import { getStreakResults } from "../lib/helpers"

// styles

import { Highlight, TitleArea } from "../styles/GlobalComponents"

// mui
import { Typography } from "@mui/material"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

type PropTypes = {
  spy: DataPointType[]
}

const Streaks = (props: PropTypes) => {
  const [spy] = useState<DataPointType[]>(props.spy)

  /*   useEffect(() => {
    setSpy(props.spy)
    //eslint-disable-next-line
  }, []) */

  const streakResults: StreakObject[] = getStreakResults(spy, 5)
  //console.log(streakResults)

  return (
    <>
      <TitleArea>
        <Typography variant="h3" gutterBottom component="div">
          <Highlight color1="darkBlue" color2="dodgerBlue" style={{ padding: "0" }}>
            Streaks
          </Highlight>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <em>5 days or more</em>
        </Typography>
      </TitleArea>
      <br />
      <hr />
      {streakResults.length && (
        <>
          {streakResults.map(item => {
            return (
              <>
                <Card key={item.startDate} sx={{ minWidth: 275, mb: "2rem" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {item.streakLength}-day {item.type}
                    </Typography>
                    <Typography sx={{ mt: 1.5 }} color="text.secondary">
                      Beginning: {item.startDate}
                    </Typography>
                  </CardContent>
                </Card>
              </>
            )
          })}
        </>
      )}
    </>
  )
}
export default Streaks

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

  const result: FetchAllDataResultType = await fetchAllData(-1)

  if (result.message !== "success") {
    return {
      props: {
        session,
        spy: []
      }
    }
  }

  if (result.message === "success") {
    return {
      props: {
        session,
        spy: result.data
      }
    }
  }
}
