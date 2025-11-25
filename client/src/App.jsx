import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import Footer from './components/Footer.jsx';
import MyBookings from './pages/MyBookings.jsx';
import NotFound from './components/NotFound.jsx';
import Rates from './pages/Rates.jsx'
import RoomReg from './pages/RoomReg.jsx';
import Layout from './pages/admin/Layout.jsx';
import About from './pages/About.jsx'
import ListRoom from './pages/admin/ListRoom.jsx';
import AddRoom from './pages/admin/AddRoom.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Archive from './pages/admin/Archive.jsx';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext.jsx';
import Loader from './components/Loader.jsx';

const App = () => {

  const isAdminPath = useLocation().pathname.includes('admin');
  const {showRoomReg, userData, loading} = useAppContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const hasRooms = userData && userData.rooms && userData.rooms.length > 0;
  return (
    <div>
      <Toaster />
      {!isAdminPath && <Navbar />}
      {showRoomReg && <RoomReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/rates' element={<Rates />} />
          <Route path='/about' element={<About />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
           <Route path='/loader/:nextUrl' element={<Loader />} />

          <Route path='/admin' element={<Layout />}>
            <Route index element={<Dashboard />} />

            <Route path='add-room' element={hasRooms ? <Navigate to="/admin" replace /> : <AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
            <Route path='archive' element={<Archive />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
