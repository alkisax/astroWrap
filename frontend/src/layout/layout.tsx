import { Outlet } from 'react-router-dom'
import Navbar from '../components/layoutComponents/Navbar'
import bgImage from '../assets/bubblePRNGrayInvertLong.jpg'

const Layout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% auto',
        backgroundColor: 'black',
      }}
    >
      <Navbar />

      {/* εδώ θα μπαίνουν όλες οι σελίδες */}
      <Outlet />
    </div>
  )
}

export default Layout