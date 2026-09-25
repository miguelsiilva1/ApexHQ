import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'

// Pages other than Home are split into their own chunks and loaded on first visit
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    // Shown while a lazy page loads on a direct visit
    hydrateFallbackElement: <div className="min-h-screen" />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/calendario',
        lazy: page(() => import('./pages/Calendario')),
      },
      {
        path: '/resultados',
        lazy: page(() => import('./pages/Resultados')),
      },
      {
        path: '/pilotos',
        lazy: page(() => import('./pages/Pilotos')),
      },
      {
        path: '/classificacoes',
        lazy: page(() => import('./pages/Classificacoes')),
      },
      {
        path: '/pistas/:circuitId',
        lazy: page(() => import('./pages/TrackDetail')),
      },
      {
        path: '/pilotos/:driverId',
        lazy: page(() => import('./pages/PilotDetail')),
      },
      {
        path: '/equipas/:constructorId',
        lazy: page(() => import('./pages/TeamDetail')),
      },
      {
        path: '/noticias/:newsId',
        lazy: page(() => import('./pages/NewsDetail')),
      },
      {
        path: '*',
        lazy: page(() => import('./pages/NotFound')),
      }
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
