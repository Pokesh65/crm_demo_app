import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import './App.css'
import Loader from './component/ui/Loader'
import { routes } from './routes/AppRoutes'
import { selectAllAuth } from './store/selectors/AuthSelector'

function App() {

  const { isLoading } = useSelector(selectAllAuth);

  return (

    <div>
      <Toaster richColors position='top-center' />
      {isLoading && <Loader />}
      <Suspense fallback={
        <Loader />
      }>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={route.path || index}
              path={route.path}
              element={route.element}
            >
              {route.children?.map((child) => (
                <Route
                  key={child.path}
                  path={child.path.replace("/", "")}
                  element={child.element}
                />
              ))}
            </Route>
          ))}

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </Suspense>
      {/* <button onClick={() => clickToaser()}>Click</button> */}
    </div>
  )
}

export default App
