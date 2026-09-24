import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Pilotos from './pages/Pilotos'
import Classificacoes from './pages/Classificacoes'
import Calendario from './pages/Calendario'
import Resultados from './pages/Resultados'
import TrackDetail from './pages/TrackDetail'
import PilotDetail from './pages/PilotDetail'
import TeamDetail from './pages/TeamDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/calendario',
        element: <Calendario />,
      },
      {
        path: '/resultados',
        element: <Resultados />,
      },
      {
        path: '/pilotos',
        element: <Pilotos />,
      },
      {
        path: '/classificacoes',
        element: <Classificacoes />,
      },
      {
        path: '/pistas/:circuitId',
        element: <TrackDetail />,
      },
      {
        path: '/pilotos/:driverId',
        element: <PilotDetail />,
      },
      {
        path: '/equipas/:constructorId',
        element: <TeamDetail />,
      }
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
