import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import FormatosPage from './pages/FormatosPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/formatos" element={<FormatosPage />} />
    </Routes>
  )
}
