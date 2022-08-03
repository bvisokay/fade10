import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import { TradingDay2Type } from "../../lib/types"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  chartData: TradingDay2Type[]
  daysBack: number
}

const BarChart: React.FC<Props> = ({ chartData, daysBack }) => {
  chartData = chartData.slice(daysBack * -1)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: false,
        text: `Past ${daysBack} Trading Days`
      }
    }
  }

  const data = {
    labels: chartData.map(item => item.stringDate.slice(0, -3)),
    datasets: [
      {
        label: "Opening Range, (fill color is tgt hit or not, border color is long/short)",
        data: chartData.map(item => (typeof item.rangeHigh === "number" && typeof item.rangeLow === "number" ? item.rangeHigh - item.rangeLow : 0)),
        backgroundColor: chartData.map(item => (typeof item.tgtHit !== "object" && item.tgtHit < 1 ? "#e84393" : "#00cec9")),
        borderColor: chartData.map(item => (typeof item.dirSignal !== "object" && item.dirSignal === "Short" ? "#fd79a8" : "#0984e3")),
        borderWidth: daysBack <= 5 ? 4 : 2
      }
    ]
  }

  return (
    <>
      <Bar options={options} data={data} />
    </>
  )
}

export default BarChart
