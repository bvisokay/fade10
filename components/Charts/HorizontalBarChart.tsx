import { GetSignalRatesReponse } from "../../lib/types"

// styles
import { breakpoints } from "../../styles/breakpoints"
import styled from "@emotion/styled"

// charts
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
//import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// eslint-disable-next-line
//ChartJS.register(ChartDataLabels)

const HBarChartContainer = styled.div`
  max-width: 500px;
  margin: 3rem auto;

  @media ${breakpoints.sm} {
    border: 1px dotted gray;
  }
`

interface PropTypes {
  period: number
  signalRates: GetSignalRatesReponse
}

const HorizontalBarChart: React.FC<PropTypes> = ({ period, signalRates }) => {
  const options = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: false,
        text: "Signal Breakdown"
      } /* ,
      datalabels: {
        display: true,
        color: "dodgerblue",
        formatter: Math.round,
        anchor: "end",
        offset: -20,
        align: "start"
      } */
    },
    scales: {
      xAxes: {
        title: {
          display: true,
          text: "Signal %"
        },
        suggestedMax: signalRates.longPercentage && signalRates.shortPercentage ? Math.max(signalRates.longPercentage, signalRates.shortPercentage) * 1.05 : 100
      }
    }
  }

  const labels = [""]

  const data = {
    labels,
    datasets: [
      {
        label: `Long (${signalRates.longOccurrences ? signalRates.longOccurrences : 0} of ${period})`,
        /*  data: `${signalRates.longPercentage ? signalRates.longPercentage * 10 : 0}`, */
        data: [`${signalRates.longPercentage ? signalRates.longPercentage.toFixed(2) : 0}`],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      },
      {
        label: `Short (${signalRates.shortOccurrences ? signalRates.shortOccurrences : 0} of ${period})`,
        data: [`${signalRates.shortPercentage ? signalRates.shortPercentage.toFixed(2) : 0}`],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      }
    ]
  }

  return (
    <HBarChartContainer>
      <Bar options={options} data={data} />
    </HBarChartContainer>
  )
}

export default HorizontalBarChart
