// styles
import { Highlight } from "../styles/GlobalComponents"
import { Typography } from "@mui/material"

export default function Home() {
  return (
    <>
      <Typography variant="h4" gutterBottom component="div">
        <Highlight color1="darkBlue" color2="blueviolet" style={{ padding: "0" }}>
          Overview
        </Highlight>
      </Typography>

      <hr />
      <br />
      <Typography variant="body1" gutterBottom>
        <strong>Analyze the results of the following trading strategy:</strong>
      </Typography>
      <Typography variant="body1">Let the first 30 minutes of the trading day of the SP500 establish an &apos;opening range.&apos; When price breaks out of this opening range, to the upside or downside, monitor if the opposite level of the opening range reached.</Typography>
      <Typography variant="body1" gutterBottom>
        <br />
        <strong>Said another way:</strong>
      </Typography>
      <Typography variant="body1">The first 30 minutes of trading establishes an &apos;opening range&apos; for the SP500. When price breaks out of the opening range, is the opposite level of the range reached as a target.</Typography>
    </>
  )
}
