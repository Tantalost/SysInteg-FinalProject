import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";


axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AppContext = createContext();

export const AppProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY || "₱";
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isAdmin, setIsAdmin] = useState(true);
    const [showRoomReg, setShowRoomReg] = useState(false);
    const [searchRooms, setSearchRooms] = useState([]);
    const [properties, setProperties] = useState([])

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () =>{
        try {
            const {data} = await axios.get('/api/properties')
            if (data.success){
                setProperties(data.properties)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser = async () => {
        try {
            const token = await getToken();
           const {data} = await axios.get('/api/user', {headers: {Authorization: `Bearer ${token}` }})
           if(data.success){
            setIsAdmin(data.role === "admin");
            setSearchRooms(data.recentSearchedRooms);
            setUserData(data.user);
           }else{
            // retry fetching user info afte 5 secs
            setUserData(null);
           }
        } catch (error) {
            console.log(error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }

    const syncUserWithBackend = async () => {
        try {
            const token = await getToken();
            await axios.post('/api/user/create', 
                {
                    username: user.fullName || user.firstName,
                    email: user.primaryEmailAddress.emailAddress,
                    image: user.imageUrl
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchUser();
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            syncUserWithBackend();
        }else{
            setLoading(false);
            setUserData(null);
        }
    }, [user]);

    useEffect(()=>{
        fetchProperties();
    },[])

    const value = {
        currency, user, getToken,
        isAdmin, setIsAdmin, axios,
        showRoomReg, setShowRoomReg, searchRooms, setSearchRooms, userData, setUserData, loading, setLoading, properties, setProperties
    }

    return(
        <AppContext.Provider value={value}>
            {children}    
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);