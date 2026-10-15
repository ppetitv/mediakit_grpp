import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import FormatosPage from './pages/FormatosPage'
import PageTransition from './components/PageTransition'
import { FORMAT_SECTION_ROUTES } from './lib/format-routes'

export default function App() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Home />} />
        {Object.values(FORMAT_SECTION_ROUTES).map(({ path }) => (
          <Route key={path} path={path} element={<FormatosPage />} />
        ))}
        <Route path="/formatos/standard/:formatSlug" element={<FormatosPage />} />
        <Route path="/formatos/:formatSlug?" element={<FormatosPage />} />
      </Routes>
    </PageTransition>
  )
}
