import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import PageTransition from './components/PageTransition'
import PageLoading, { PageLoadBoundary } from './components/PageLoading'
import { FORMAT_SECTION_ROUTES } from './lib/format-routes'
import { loadFormatsPage } from './lib/page-loaders'

const FormatosPage = lazy(loadFormatsPage)

export default function App() {
  return (
    <PageTransition>
      <PageLoadBoundary>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {Object.values(FORMAT_SECTION_ROUTES).map(({ path }) => (
              <Route key={path} path={path} element={<FormatosPage />} />
            ))}
            <Route path="/formatos/standard/:formatSlug" element={<FormatosPage />} />
            <Route path="/formatos/:formatSlug?" element={<FormatosPage />} />
          </Routes>
        </Suspense>
      </PageLoadBoundary>
    </PageTransition>
  )
}
