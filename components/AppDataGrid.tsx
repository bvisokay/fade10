import Box from "@mui/material/Box"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import { FormControlLabel, IconButton } from "@mui/material"

import { TradingDayType } from "../lib/types"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"

interface ActionPropTypes {
  index: number
}

const ActionsColumn: React.FC<ActionPropTypes> = ({ index }) => {
  const handleEditClick = () => {
    // some action
    alert("Edit clicked")
    console.log("Edit clicked: ", index)
  }

  const handleDeleteClick = () => {
    // some action
    alert("Delete clicked")
    console.log("Delete clicked: ", index)
  }

  return (
    <>
      <FormControlLabel
        label={""}
        control={
          <>
            <IconButton color="secondary" aria-label="edit" onClick={handleEditClick}>
              <EditIcon style={{ color: "dodgerblue" }} />
            </IconButton>
            <IconButton color="secondary" aria-label="delete" onClick={handleDeleteClick}>
              <DeleteIcon style={{ color: "crimson", marginLeft: "4px" }} />
            </IconButton>
          </>
        }
      />
    </>
  )
}

interface PropTypes {
  spy: TradingDayType[]
}

interface ParamsType {
  row: {
    id: number
  }
}

const AppDataGrid: React.FC<PropTypes> = props => {
  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params: ParamsType) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
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

  rows = props.spy.map((item, index) => {
    return {
      id: index + 1, //
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      date: `${item.formattedDate!.getUTCMonth() + 1}/${item.formattedDate!.getUTCDate()}/${item.formattedDate!.getUTCFullYear()}`,
      actions: `{<DeleteIcon/>}`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tgthit: parseInt(item.tgtHit!) === 1 ? "Yes" : typeof item.tgtHit === "object" ? "n/a" : "No",
      range: typeof item.rangeHigh === "number" && typeof item.rangeLow === "number" ? Math.round((item.rangeHigh - item.rangeLow) * 100) / 100 : "",
      rangehigh: item.rangeHigh,
      rangelow: item.rangeLow,
      signal: item.dirSignal !== "NULL" ? item.dirSignal : "n/a",
      signaltime: item.signalTime ? item.signalTime.slice(0, 5) : "n/a",
      tgthittime: item.tgtHitTime ? item.tgtHitTime?.slice(0, 5) : "n/a"
    }
  })

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight={true} />
    </Box>
  )
}

export default AppDataGrid
