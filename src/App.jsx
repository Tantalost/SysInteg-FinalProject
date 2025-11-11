import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AllRooms from './pages/AllRooms.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import Footer from './components/Footer.jsx';
import MyBookings from './pages/MyBookings.jsx';
import NotFound from './components/NotFound.jsx';
import Rates from './pages/Rates.jsx'
import RoomReg from './pages/RoomReg.jsx';
import Layout from './pages/admin/Layout.jsx';
import ListRoom from './pages/admin/ListRoom.jsx';
import AddRoom from './pages/admin/AddRoom.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';

const App = () => {

  const isAdminPath = useLocation().pathname.includes('admin');

  return (
    <div>
      {!isAdminPath && <Navbar />}
      {false && <RoomReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rates' element={<Rates />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/*' element={<NotFound />} />
          <Route path='/admin' element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path='add-room' element={<AddRoom />} />
              <Route path='list-room' element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
