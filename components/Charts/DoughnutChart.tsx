import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { TradingDay2Type } from "../../lib/types"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  chartData: TradingDay2Type[]
  daysBack: number
}

const DoughnutChart: React.FC<Props> = ({ chartData, daysBack }) => {
  console.log("chartData: ", chartData)
  console.log("daysBack: ", daysBack)
  const data = {
    labels: ["Short", "Long", "Other"],
    datasets: [
      {
        label: "hit",
        data: [75, 15, 10],
        backgroundColor: ["rgba(255, 99, 132, .1)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"]
      }
    ]
  }

  return <Doughnut data={data} />
}

export default DoughnutChart
