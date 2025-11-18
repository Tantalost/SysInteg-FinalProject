import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY || "₱";
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [showRoomReg, setShowRoomReg] = useState(false);
    const [searchRooms, setSearchRooms] = useState([]);

    const fetchUser = async () => {
        try {
           const {data} = await axios.get('/api/user', {headers: {Authorization: 'Bearer ₱{await getToken()}' }})
           if(data.success){
            setIsAdmin(data.role === "roomAdmin");
            setSearchRooms(data.recentSearchedRooms)
           }else{
            // retry fetching user info afte 5 secs
            setTimeout(()=>{
                fetchUser()}, 5000)
           }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(user){
            fetchUser();
        }
    },[user])

    const value = {
        currency, navigate, user, getToken,
        isAdmin, setIsAdmin, axios,
        showRoomReg, setShowRoomReg, searchRooms, setSearchRooms,
    }

    return(
        <AppContext.Provider value={value}>
            {children}    
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);