import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import { Typography, Box } from "@mui/material"
import { DataPointType, FetchAllDataResultType } from "../lib/types"
import { useEffect, useState } from "react"
import BarChart from "../components/Charts/BarChart"
//import DoughnutChart from "../components/Charts/DoughnutChart"
import { breakpoints } from "../styles/breakpoints"
import styled from "@emotion/styled"
import { fetchAllData } from "../lib/util"

// styles
import { Highlight } from "../styles/GlobalComponents"

type PropTypes = {
  spy: DataPointType[]
}

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  @media ${breakpoints.sm} {
    flex-direction: row;
  }
`

const Summary = (props: PropTypes) => {
  const periods = [5, 20, 60, 200]
  const [spy, setSpy] = useState<DataPointType[]>([])

  useEffect(() => {
    setSpy(props.spy)
    //eslint-disable-next-line
  }, [])

  const getWinRate = (period: number) => {
    if (spy.length) {
      const results = spy.slice(period * -1).reduce((currentTotal, item) => {
        if (typeof item.tgtHit !== "object" && typeof item.tgtHit === "number") {
          return item.tgtHit + currentTotal
        } else return currentTotal
      }, 0)
      return results
      //return period
    } else {
      return period * -1
    }
  }

  const getLongSignalRate = (period: number) => {
    const results = spy.slice(period * -1).reduce((currentTotal, item) => {
      if (item.dirSignal !== "object" && item.dirSignal === "Long") {
        return 1 + currentTotal
      } else return currentTotal
    }, 0)
    return results
  }

  return (
    <>
      <TitleArea>
        <Typography variant="h3" gutterBottom component="div">
          <Highlight color1="darkBlue" color2="dodgerBlue" style={{ padding: "0" }}>
            Summary
          </Highlight>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <em>Data updated through: {spy.length ? spy[spy.length - 1].displayDate : "Come again"}</em>
        </Typography>
      </TitleArea>
      <hr />

      {periods.map((period, index) => {
        if (period > spy.length) {
          period = spy.length
        }
        const wins = getWinRate(period)
        const longRate = getLongSignalRate(period)
        return (
          <Box mt={10} mb={10} key={index}>
            <Typography mb={4} variant="h5">
              <strong>Last {period} Trading Days</strong>
              {/* {wins && wins >= 1 ? `${Math.round((wins / period) * 100)}% (${wins} of ${period})` : ""} */}
            </Typography>
            <Typography mb={4} variant="body1">
              <strong>Hit Rate: </strong>
              {wins && wins >= 1 ? `${Math.round((wins / period) * 100)}% (${wins} of ${period})` : ""}
            </Typography>
            <Typography mb={4} variant="body1">
              <strong>Signal Rate: </strong>
              {longRate && longRate >= 1 ? `${Math.round((longRate / period) * 100)}% Long (${longRate} of ${period})` : ""}
            </Typography>
            {spy.length && (
              <Box mt={3} mb={3}>
                <BarChart chartData={spy} daysBack={period} />
              </Box>
            )}
            {/*    {spy.length && (
              <Box width={200} height={200} mt={3} mb={3}>
                <DoughnutChart chartData={spy} daysBack={period} />
              </Box>
            )} */}
          </Box>
        )
      })}
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
