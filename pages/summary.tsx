import { useEffect, useState } from "react"
import { GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/react"

//types
import { DataPointType, FetchAllDataResultType } from "../lib/types"

// util functions
import { getSignalRates } from "../lib/helpers"
import { fetchAllData } from "../lib/util"

// chart and other comps
import BarChart from "../components/Charts/BarChart"
import DoughnutChart from "../components/Charts/DoughnutChart"
import HorizontalBarChart from "../components/Charts/HorizontalBarChart"
import MonthlySummary from "../components/MonthlySummary"

// accordian
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

//styles
import { Typography, Box } from "@mui/material"
import { breakpoints } from "../styles/breakpoints"
import styled from "@emotion/styled"
import { Highlight } from "../styles/GlobalComponents"

type PropTypes = {
  spy: DataPointType[]
}

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  @media ${breakpoints.sm} {
    flex-direction: row;
  }
`

const DoughBoxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin: 4rem auto;
  @media ${breakpoints.sm} {
    flex-direction: row;
    //border: 1px solid crimson;
  }
`

const DoughBox = styled.div`
  // has the title so this can't be the grid
  //border: 1px solid dodgerblue;
  max-width: 200px;
  padding: 2rem 0;
  @media ${breakpoints.sm} {
    flex-direction: row;
    padding: 0;
    //border: 1px solid crimson;
  }
`

const Summary = (props: PropTypes) => {
  const periods = [20, 60, 240]
  const [spy, setSpy] = useState<DataPointType[]>([])

  useEffect(() => {
    setSpy(props.spy)
    //eslint-disable-next-line
  }, [])

  return (
    <>
      <TitleArea>
        <Typography variant="h3" gutterBottom component="div">
          <Highlight color1="darkBlue" color2="dodgerBlue" style={{ padding: "0" }}>
            Summary
          </Highlight>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <em>Data updated through: {spy.length ? spy[spy.length - 1].displayDate : "Come again"}</em>
        </Typography>
      </TitleArea>
      <br />
      <hr />
      <br />
      {periods.map((period, index) => {
        if (period > spy.length) {
          period = spy.length
        }
        const signalRates = getSignalRates(period, spy)

        return (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography>
                <strong>Last {period} Trading Days</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"h5"} sx={{ textAlign: "center" }}>
                Hit Rates
              </Typography>
              <DoughBoxContainer>
                <DoughBox>
                  <Typography sx={{ textAlign: "center" }}>Overall</Typography>
                  <DoughnutChart chartData={spy} daysBack={period} />
                </DoughBox>
                <DoughBox>
                  <Typography sx={{ textAlign: "center" }}>Long Only</Typography>
                  <DoughnutChart chartData={spy} daysBack={period} signal={"Long"} />
                </DoughBox>
                <DoughBox>
                  <Typography sx={{ textAlign: "center" }}>Short Only</Typography>
                  <DoughnutChart chartData={spy} daysBack={period} signal={"Short"} />
                </DoughBox>
              </DoughBoxContainer>
              <Typography variant={"h5"} sx={{ textAlign: "center" }}>
                Daily Detail
              </Typography>
              <Box mt={3} mb={6}>
                <BarChart chartData={spy} daysBack={period} />
              </Box>
              <Typography mb={4} variant={"h5"} sx={{ textAlign: "center" }}>
                Signal Breakdown
              </Typography>
              <HorizontalBarChart period={period} signalRates={signalRates} />
            </AccordionDetails>
          </Accordion>
        )
      })}
      <br />
      <br />
      <Typography variant={"h5"} sx={{ textAlign: "center" }}>
        Monthly
      </Typography>
      <hr />
      <br />
      {spy.length && <MonthlySummary spy={spy} />}
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

  const result: FetchAllDataResultType = await fetchAllData(-1)

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
