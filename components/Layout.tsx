//import Header_02 from "./Header_02"
import AppBar from "./AppBar"
import Footer from "./Footer"

type LayoutProps = {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = props => {
  return (
    <div className="layout-container">
      {/* <Header_02 /> */}
      <AppBar />
      <main style={{ paddingTop: "9rem" }}>
        <div className="wrapper">{props.children}</div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
