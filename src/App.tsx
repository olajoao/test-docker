import { Outlet } from '@tanstack/react-router'
import Layout from './routes/_layout'

function App() {
  return (
    <Layout children={<Outlet />} />
  )
}

export default App
