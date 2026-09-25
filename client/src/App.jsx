import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home' 
import Login from './pages/Login'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Dashboard from './pages/dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App(){
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route
        path='/booking'
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path='/my-bookings'
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute allowedRoles={['practitioner']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App