import Navbar from './components/Navbar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AllRooms from './pages/AllRooms.jsx';

const App = () => {

  const isAdminPath = useLocation().pathname.includes('admin');

  return (
    <div>
      {!isAdminPath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
