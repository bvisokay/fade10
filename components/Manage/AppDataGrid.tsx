import { useContext } from "react"
import { ManageStateContext } from "../../store/ManageContext"

//comps
import ActionsColumn from "./ActionsColumn"

// mui
import Box from "@mui/material/Box"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

interface ParamsType {
  row: {
    id: number
  }
}

const AppDataGrid: React.FC = () => {
  const manageState = useContext(ManageStateContext)

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 100, type: "date" },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params: ParamsType) => {
        return (
          <div style={{ cursor: "pointer" }}>
            <ActionsColumn index={params.row.id} />
          </div>
        )
      }
    },
    { field: "tgthit", headerName: "Tgt Hit", width: 100 },
    { field: "range", headerName: "Price Range", width: 100 },
    { field: "rangehigh", headerName: "Range High", width: 100 },
    { field: "rangelow", headerName: "Range Low", width: 100 },
    { field: "signal", headerName: "Signal", width: 100 },
    { field: "signaltime", headerName: "Signal Time", width: 100 },
    { field: "tgthittime", headerName: "Tgt Hit Time", width: 100 }
  ]

  let rows: GridRowsProp = []

  rows = manageState.spy.map((item, index) => {
    return {
      id: index + 1, //
      date: item.displayDate,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tgthit: item.tgtHit === 1 || item.tgtHit === "Yes" ? "Yes" : item.tgtHit === 0 || item.tgtHit === "No" ? "No" : "n/a",
      range: typeof item.rangeHigh === "number" && typeof item.rangeLow === "number" ? (Math.round((item.rangeHigh - item.rangeLow) * 100) / 100).toFixed(2) : "",
      rangehigh: typeof item.rangeHigh === "number" ? (Math.round(item.rangeHigh * 100) / 100).toFixed(2) : "",
      rangelow: typeof item.rangeLow === "number" ? (Math.round(item.rangeLow * 100) / 100).toFixed(2) : "",
      signal: item.dirSignal === "NULL" || item.dirSignal === "" ? "n/a" : item.dirSignal,
      signaltime: item.signalTime || item.signalTime === "00:00:00" ? item.signalTime.slice(0, 5) : "n/a",
      tgthittime: item.tgtHitTime || item.tgtHitTime === "00:00:00" ? item.tgtHitTime?.slice(0, 5) : "n/a"
    }
  })

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight={true} />
    </Box>
  )
}

export default AppDataGrid
