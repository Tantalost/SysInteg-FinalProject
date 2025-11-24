import React, { useEffect } from 'react';
import Navbar from '../../components/admin/Navbar';
import Sidebar from '../../components/admin/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
    const { isAdmin } = useAppContext();
    const navigate = useNavigate();

    // 1. Authorization Redirect
    useEffect(() => {
        if (isAdmin === false) { 
            navigate('/');
        }
    }, [isAdmin, navigate]); 

    if (isAdmin === undefined) {
       
        return <div className='p-8 text-center'>Loading permissions...</div>;
    }
    
    return (
        <div className='flex flex-col min-h-screen bg-gray-50'>
            {/* 1. Navbar (Fixed Position) */}
            <div className='sticky top-0 z-20'>
                <Navbar />
            </div>
            
            {/* 2. Main Content Area */}
            <div className='flex flex-1'>
                
                {/* Sidebar (Fixed Position) */}
                {/* The height 'h-full' here should be relative to its container (flex-1) */}
                <div className='flex-shrink-0'>
                    <Sidebar />
                </div>
                
                {/* Content Outlet */}
                {/* The main content area takes up the rest of the horizontal space (flex-1)
                    and has dynamic top padding (pt-4) to account for the fixed Navbar height. */}
                <main className='flex-1 p-4 md:p-8 overflow-y-auto'>
                    <div className='w-full'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;