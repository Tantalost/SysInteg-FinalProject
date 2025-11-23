import React from 'react'
import Navbar from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom';



const Layout = () => {
  const {isAdmin} = useAppContext();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!isAdmin){
      navigate('/')
    }
  },[isAdmin])
  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <Sidebar />
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
            <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Layout
