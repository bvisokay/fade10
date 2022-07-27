import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
// non-mui comps
import { useRouter } from "next/router"
import Link from "next/link"
import { SITENAME } from "../pages/_app"

import { useSession, signOut } from "next-auth/react"

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
}

const drawerWidth = 240

const navItems = [
  { displayName: "Data", path: "/data" },
  { displayName: "Summary", path: "/summary" }
]

export default function DrawerAppBar(props: Props) {
  const router = useRouter()
  const { status } = useSession()
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // log user out on click
  const logoutHandler = () => {
    void signOut()
    void router.push("/")
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link href="/">
          <a>{SITENAME}</a>
        </Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map(item => (
          <ListItem key={item.displayName} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              {/* <ListItemText primary={item.displayName} /> */}
              <Link href={item.path}>
                <ListItemText primary={item.displayName} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav" style={{ padding: ".7rem 0" }}>
        <Toolbar style={{ margin: "0 auto", width: "100%", maxWidth: "848px" }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { sm: "block" } }}>
            <Link href="/">
              <a>{SITENAME}</a>
            </Link>
          </Typography>
          <Button variant="outlined" sx={{ color: "#fff" }}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </Button>

          {status === "authenticated" && (
            <>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {navItems.map(item => (
                  <Button key={item.displayName} sx={{ color: "#fff" }}>
                    <Link href={item.path}>
                      <a>{item.displayName}</a>
                    </Link>
                  </Button>
                ))}
              </Box>
              <Button variant="outlined" onClick={() => logoutHandler()} sx={{ color: "#fff" }}>
                Logout
              </Button>
            </>
          )}
          {status !== "authenticated" && (
            <>
              <Button variant="outlined" sx={{ color: "#fff" }}>
                <Link href="/register">
                  <a>Sign Up</a>
                </Link>
              </Button>
              <Button variant="outlined" sx={{ color: "#fff" }}>
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
}
