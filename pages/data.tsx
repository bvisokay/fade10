import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchAllData } from "../lib/util"
// types
import { DataPointType, FetchAllDataResultType } from "../lib/types"
// styles
import { Highlight } from "../styles/GlobalComponents"

type PropTypes = {
  spy: DataPointType[]
}

const Data: React.FC<PropTypes> = props => {
  console.log(props.spy)

  const [spy, setSpy] = useState<DataPointType[]>([])

  useEffect(() => {
    setSpy(props.spy)
  }, [])

  const columns: GridColDef[] = [
    { field: "col1", headerName: "Date", width: 100 },
    { field: "col2", headerName: "Tgt Hit", width: 65 },
    { field: "col3", headerName: "Range High", width: 100 },
    { field: "col4", headerName: "Range Low", width: 100 },
    { field: "col5", headerName: "Price Range", width: 100 },
    { field: "col6", headerName: "Signal", width: 100 },
    { field: "col7", headerName: "Signal Time", width: 100 },
    { field: "col8", headerName: "Tgt Hit Time", width: 100 }
  ]

  let rows: GridRowsProp = []

  rows = spy.map((item, index) => {
    return {
      id: index + 1, //
      col1: item.displayDate,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      col2: item.tgtHit === 1 ? "Yes" : typeof item.tgtHit === "object" ? "n/a" : "No",
      col3: item.rangeHigh.toFixed(2),
      col4: item.rangeLow.toFixed(2),
      col5: typeof item.rangeHigh === "number" && typeof item.rangeLow === "number" ? (Math.round((item.rangeHigh - item.rangeLow) * 100) / 100).toFixed(2) : "",
      col6: item.dirSignal !== "NULL" ? item.dirSignal : "n/a",
      col7: item.signalTime ? item.signalTime.slice(0, 5) : "n/a",
      col8: item.tgtHitTime ? item.tgtHitTime?.slice(0, 5) : "n/a"
    }
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

  const result: FetchAllDataResultType = await fetchAllData()

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
