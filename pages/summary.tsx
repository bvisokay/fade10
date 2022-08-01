import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import { Typography } from "@mui/material"
import { DataRowType, TradingDayType, TradingDay2Type, QueryResponseType } from "../lib/types"
import executeQuery from "../lib/db"
import { useEffect, useState } from "react"

// charts
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js"
import { Bubble } from "react-chartjs-2"
ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

// styles
import { Highlight } from "../styles/GlobalComponents"

type PropTypes = {
  spy: TradingDay2Type[]
}

const Summary = (props: PropTypes) => {
  console.log(props.spy)
  const [spy, setSpy] = useState<TradingDay2Type[]>([])
  const [lastFive, setLastFive] = useState<number>()
  const [lastTwenty, setLastTwenty] = useState<number>()
  const [updatedDate, setUpdatedDate] = useState<Date | undefined>()

  useEffect(() => {
    const datedAndSortedSpy = props.spy
      .map(item => {
        item.formattedDate = new Date(item.date)
        item.tgtHit = typeof item.tgtHit !== "object" ? item.tgtHit : -1
        return { ...item }
      })
      .sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.formattedDate! > b.formattedDate!) return -1
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (a.formattedDate! < b.formattedDate!) return 1
        else return 0
      })
    setSpy(datedAndSortedSpy)
    const updatedThroughDate = new Date(datedAndSortedSpy[0].date)
    setUpdatedDate(updatedThroughDate)
    // last 5 trading days
    const lastFiveData = datedAndSortedSpy.slice(0, 5)
    const lastFiveWinRate = lastFiveData.reduce((currentTotal, item) => {
      if (item && item.tgtHit != null) {
        return item.tgtHit + currentTotal
      } else return 0 + currentTotal
    }, 0)
    setLastFive(lastFiveWinRate)
    // last 20 trading days
    const lastTwentyData = datedAndSortedSpy.slice(0, 20)
    const lastTwentyWinRate = lastTwentyData.reduce((currentTotal, item) => {
      if (item && item.tgtHit) {
        return item.tgtHit + currentTotal
      } else return 0 + currentTotal
    }, 0)
    setLastTwenty(lastTwentyWinRate)

    //eslint-disable-next-line
  }, [])

  const options = {
    elements: {
      point: {
        pointStyle: "circle"
      }
    },
    labels: {
      x: "Test"
    },
    scales: {
      y: {
        beginAtZero: false
      },
      x: {
        beginAtZero: false
      }
    }
  }

  // data: {x: number, y: number, r: number}
  const ChartReadyData = spy
    .sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (a.formattedDate! < b.formattedDate!) return -1
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (a.formattedDate! > b.formattedDate!) return 1
      else return 0
    })
    .map((item, index) => {
      const date = new Date(item.date)
      const tradingDate = `${date.getMonth() + 1}/${date.getUTCDate()}/${date.getFullYear()}`
      console.log(tradingDate)
      return {
        x: index + 1 - spy.length,
        y: typeof item.rangeHigh === "number" && typeof item.rangeLow === "number" ? (item.rangeHigh - item.rangeLow).toFixed(1) : 1,
        r: !item.tgtHit ? 4 : 4.25
      }
    })

  const data = {
    datasets: [
      {
        label: "Trading Days (x days back)",
        data: ChartReadyData,
        backgroundColor: function (context) {
          const index = context.dataIndex
          const value = context.dataset.data[index]
          return value % 2 === 0
            ? "red" // draw negative values in red
            : "dodgerBlue"
        }
      }
    ]
  }

  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        <Highlight color1="darkBlue" color2="dodgerBlue" style={{ padding: "0" }}>
          Summary
        </Highlight>
      </Typography>
      <hr />
      <Typography variant="body1" gutterBottom>
        <strong>Data updated through:</strong>{" "}
        {updatedDate && (
          <>
            {updatedDate.getMonth() + 1}/{updatedDate.getUTCDate()}/{updatedDate.getFullYear()}
          </>
        )}
      </Typography>

      <Typography variant="body1" gutterBottom>
        <strong>Last 5 Trading Days: </strong>
        {lastFive && lastFive >= 1 ? `${(lastFive / 5) * 100}% (${lastFive} of 5)` : ""}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Last 20 Trading Days: </strong>
        {lastTwenty && lastTwenty >= 1 ? `${(lastTwenty / 20) * 100}% (${lastTwenty} of 5)` : ""}
      </Typography>

      <Bubble options={options} data={data} />
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
