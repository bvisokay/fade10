import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import { Typography } from "@mui/material"

import { useEffect, useState } from "react"
import executeQuery from "../lib/db"
// types
import { QueryResponseType, DataRowType, TradingDayType } from "../lib/types"
// styles
import { Highlight } from "../styles/GlobalComponents"

type PropTypes = {
  spy: TradingDayType[]
}

const Data = (props: PropTypes) => {
  const [spy, setSpy] = useState<TradingDayType[]>([])

  useEffect(() => {
    const datedAndSortedSpy = props.spy
      .map(item => {
        item.formattedDate = new Date(item.date)
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
    //eslint-disable-next-line
  }, [])

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Date", width: 100 },
    { field: "col2", headerName: "Tgt Hit", width: 100 },
    { field: "col3", headerName: "Range High", width: 100 },
    { field: "col4", headerName: "Range Low", width: 100 },
    { field: "col5", headerName: "Price Range", width: 100 },
    { field: "col6", headerName: "Signal", width: 100 },
    { field: "col7", headerName: "Signal Time", width: 100 },
    { field: "col8", headerName: "Tgt Hit Time", width: 100 }
  ]

  let rows: GridRowsProp = []

  rows = spy.map((item, index) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { id: index + 1, col1: `${item.formattedDate!.getUTCMonth() + 1}/${item.formattedDate!.getUTCDate()}/${item.formattedDate!.getUTCFullYear()}`, col2: parseInt(item.tgtHit!) === 1 ? "Yes" : typeof item.tgtHit === "object" ? "n/a" : "No", col3: item.rangeHigh, col4: item.rangeLow, col5: typeof item.rangeHigh === "number" && typeof item.rangeLow === "number" ? Math.round((item.rangeHigh - item.rangeLow) * 100) / 100 : "", col6: item.dirSignal !== "NULL" ? item.dirSignal : "n/a", col7: item.signalTime ? item.signalTime.slice(0, 5) : "n/a", col8: item.tgtHitTime ? item.tgtHitTime?.slice(0, 5) : "n/a" }
  })

  if (!spy.length) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        <Highlight color1="darkBlue" color2="aqua" style={{ padding: "0" }}>
          All Data
        </Highlight>
      </Typography>

      <hr />
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  )
}
export default Data

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
