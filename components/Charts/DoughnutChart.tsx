import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { DataPointType } from "../../lib/types"
import { getWinRateBySignal } from "../../lib/helpers"
import styled from "@emotion/styled"

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutCenter = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  max-width: 160px;
`

const DoughValue = styled.div`
  //border: 1px solid dodgerblue;
  grid-row: 1;
  grid-column: 1;
  font-size: 2rem;
  align-self: center;
  text-align: center;
  color: rgba(54, 162, 235, 0.9);
  font-weight: bold;
`

const DoughGraph = styled.div`
  grid-row: 1;
  grid-column: 1;
  max-width: 160px;
`

interface Props {
  chartData: DataPointType[]
  daysBack: number
  signal?: string
}

const DoughnutChart: React.FC<Props> = ({ chartData, daysBack, signal }) => {
  chartData = chartData.slice(daysBack * -1)
  //console.log("chartData: ", chartData)
  //console.log("daysBack: ", daysBack)

  const result = getWinRateBySignal(daysBack, chartData, signal)
  //console.log("Long Win Rate: ", result)

  const { percentage } = result

  const data = {
    labels: [
      /* `${signal} hit rate`, "other" */
    ],
    datasets: [
      {
        label: "hit",
        data: [percentage ? percentage : 0, percentage ? 100 - percentage : 0],
        backgroundColor: ["rgba(54, 162, 235, 0.45)", "rgba(54, 162, 235, 0.1)"]
      }
    ]
  }

  return (
    <>
      <DoughnutCenter>
        <DoughValue>{percentage}%</DoughValue>
        <DoughGraph>
          <Doughnut data={data} />
        </DoughGraph>
      </DoughnutCenter>
    </>
  )
}

export default DoughnutChart
