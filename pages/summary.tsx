import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import { Typography, Box } from "@mui/material"
import { DataRowType, TradingDayType, TradingDay2Type, QueryResponseType } from "../lib/types"
import executeQuery from "../lib/db"
import { useEffect, useState } from "react"
import BarChart from "../components/Charts/BarChart"
//import DoughnutChart from "../components/Charts/DoughnutChart"
import { breakpoints } from "../styles/breakpoints"
import styled from "@emotion/styled"

// styles
import { Highlight } from "../styles/GlobalComponents"

type PropTypes = {
  spy: TradingDay2Type[]
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
  const periods = [5, 20, 60]
  const [spy, setSpy] = useState<TradingDay2Type[]>([])

  useEffect(() => {
    /* sort with oldest at the end */
    const datedAndSortedSpy = props.spy
      .map(item => {
        item.formattedDate = new Date(item.date)
        item.stringDate = `${item.formattedDate.getUTCMonth() + 1}/${item.formattedDate.getUTCDate()}/${item.formattedDate.getUTCFullYear().toString().slice(-2)}`
        item.tgtHit = typeof item.tgtHit !== "object" ? item.tgtHit : -1
        return { ...item }
      })
      .sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.formattedDate! > b.formattedDate!) return 1
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.formattedDate! < b.formattedDate!) return -1
        else return 0
      })
    setSpy(datedAndSortedSpy)

    //eslint-disable-next-line
  }, [])

  const getWinRate = (period: number) => {
    if (spy.length) {
      const results = spy.slice(period * -1).reduce((currentTotal, item) => {
        if (typeof item.tgtHit !== "object") {
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
          <em>Data updated through: {spy.length ? spy[spy.length - 1].stringDate : "Come again"}</em>
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

  try {
    const response = (await executeQuery(`SELECT * FROM spy`)) as QueryResponseType

    if (response.error) {
      //eslint-disable-next-line
      console.log(`Error from DB operation: ${response.error}`)
      throw new Error()
    }
    let cleanedResponse: TradingDayType[] = []

    if (Array.isArray(response)) {
      cleanedResponse = response.map((item: DataRowType) => {
        return {
          date: item.date.toString(),
          rangeHigh: item.rangehigh,
          rangeLow: item.rangelow,
          dirSignal: item.dirsignal,
          signalTime: item.signaltime,
          tgtHit: item.tgthit,
          tgtHitTime: item.tgthittime,
          notes: item.notes
        }
      })
    }

    return {
      props: {
        spy: cleanedResponse
      }
    }
  } catch (err) {
    //eslint-disable-next-line
    console.log(`There was an error: ${err}`)
    return {
      props: {
        spy: []
      }
    }
  }
}
