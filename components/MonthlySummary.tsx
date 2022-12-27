import { DataPointType } from "../lib/types"
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid"
import { getMonthlySummary } from "../lib/helpers"

interface PropTypes {
  spy: DataPointType[]
}

const MonthlySummary: React.FC<PropTypes> = ({ spy }) => {
  /*
   * define the months we want to get summary data for
   * ["greater than or equal to date", "less than date"]
   * more recent on the top
   */
  const tgtMonths = [
    ["2022-09-01", "2022-10-01"],
    ["2022-08-01", "2022-09-01"],
    ["2022-07-01", "2022-08-01"],
    ["2022-06-01", "2022-07-01"],
    ["2022-05-01", "2022-06-01"],
    ["2022-04-01", "2022-05-01"],
    ["2022-03-01", "2022-04-01"],
    ["2022-02-01", "2022-03-01"],
    ["2022-01-01", "2022-02-01"],
    ["2021-12-01", "2022-01-01"],
    ["2021-11-01", "2021-12-01"],
    ["2021-10-01", "2021-11-01"],
    ["2021-09-01", "2021-10-01"],
    ["2021-08-01", "2021-09-01"],
    ["2021-07-01", "2021-08-01"],
    ["2021-06-01", "2021-07-01"],
    ["2021-05-01", "2021-06-01"],
    ["2021-04-01", "2021-05-01"],
    ["2021-03-01", "2021-04-01"],
    ["2021-02-01", "2021-03-01"],
    ["2021-01-01", "2021-02-01"] //
  ]

  // Run loop to calc monthly results and store monthly result objects  in array
  const bulkResults = []
  for (let i = 0; i <= tgtMonths.length - 1; i++) {
    const monthlyResult = getMonthlySummary(spy, tgtMonths[i][0], tgtMonths[i][1])
    bulkResults.push(monthlyResult)
  }

  // Configure Data Grid
  const columns: GridColDef[] = [
    { field: "month", headerName: "Month", width: 100, type: "date", sortable: false, filterable: false },
    { field: "overallHitRate", headerName: "Overall Hit Rate %", width: 140, type: "number", headerAlign: "center", align: "center" },
    { field: "longHitRate", headerName: "Long Hit Rate %", width: 140, type: "number", headerAlign: "center", align: "center" },
    { field: "shortHitRate", headerName: "Short Hit Rate %", width: 140, type: "number", headerAlign: "center", align: "center" },
    { field: "tradingDays", headerName: "Trading days", width: 100, type: "number", headerAlign: "center", align: "center" }
    // optional fields to display
    //{ field: "overallHit", headerName: "overallHit", width: 100 },
    //{ field: "numLongDays", headerName: "numLongDays", width: 100 },
    //{ field: "numLongHit", headerName: "numLongHit", width: 100 },
    //{ field: "numShortDays", headerName: "numShortDays", width: 100 },
    //{ field: "numShortHit", headerName: "numShortHit", width: 100 },
    //{ field: "numOtherDays", headerName: "numOtherDays", width: 100 }
  ]

  let rows: GridRowsProp = []

  rows = bulkResults.map((item, index) => {
    if (!item.data.length) return
    const displayDate = new Date(item.data[0].displayDate).toLocaleDateString("en-CA", {
      timeZone: "UTC",
      month: "short",
      year: "2-digit"
    })

    return {
      id: index + 1,
      month: displayDate,
      overallHitRate: item.overallHitRate,
      longHitRate: item.longHitRate,
      shortHitRate: item.shortHitRate,
      tradingDays: item.tradingDays //
      // optional data to display
      //overallHit: item.overallHit,
      //numLongDays: item.numLongDays,
      //numLongHit: item.numLongHit,
      //numShortDays: item.numShortDays,
      //numShortHit: item.numShortHit,
      //numOtherDays: item.numOtherDays
    }
  })

  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  )
}

export default MonthlySummary
