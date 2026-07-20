import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import FormatosPage from './pages/FormatosPage'
import PageTransition from './components/PageTransition'

export default function App() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formatos/:formatSlug?" element={<FormatosPage />} />
      </Routes>
    </PageTransition>
  )
}
