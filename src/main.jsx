import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Campsite from './pages/Campsite.jsx'
import MountainForest from './pages/MountainForest.jsx'
import LakeEdge from './pages/LakeEdge.jsx'
import CampsiteNight from './pages/CampsiteNight.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campsite" element={<Campsite />} />
        <Route path="/mountain-forest" element={<MountainForest />} />
        <Route path="/lake-edge" element={<LakeEdge />} />
        <Route path="/campsite-night" element={<CampsiteNight />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)