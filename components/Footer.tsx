import { SITENAME } from "../pages/_app"
import { useSession } from "next-auth/react"
import { Typography } from "@mui/material"

export default function Footer() {
  const { data: session, status } = useSession()
  return (
    <footer>
      <div className="wrapper" style={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2, color: "white" }}>
          {SITENAME}
        </Typography>
        {status === "authenticated" && (
          <Typography variant="body2" sx={{ my: 2, color: "white" }}>
            Logged in as: {session?.user?.name?.charAt(0).toUpperCase()}
            {session?.user?.name?.slice(1)}
          </Typography>
        )}
      </div>
    </footer>
  )
}
