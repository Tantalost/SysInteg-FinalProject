import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AllRooms from './pages/AllRooms.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import Footer from './components/Footer.jsx';
import MyBookings from './pages/MyBookings.jsx';
import NotFound from './components/NotFound.jsx';

const App = () => {

  const isAdminPath = useLocation().pathname.includes('admin');

  return (
    <div>
      {!isAdminPath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/*' element={<NotFound />} />

        </Routes>
      </div>
     <Footer />
    </div>
  )
}

export default App
