import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home' 
import Login from './pages/Login'
import Booking from './pages/Booking'
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
    </Routes>
  )
}

export default App