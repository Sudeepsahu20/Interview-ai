import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../../services/auth.api";


export const useAuth=()=>{
    const context=useContext(AuthContext);
    const {loading,setLoading,user,setUser}=context;

    const handleLogin=async({email,password})=>{
         setLoading(true);
         try {
             const data=await login({email,password});
             console.log(data);
         setUser(data.user);
         return true;
         } catch (error) {
            console.error(error);
         }
        finally{
setLoading(false);
        }
         
    }


    const handleRegister=async({username,email,password})=>{
           setLoading(true);
           try {
              const data=await register({username,email,password});
           setUser(data.user);
           return true;
           } catch (error) {
            console.error(error);
           }finally{
setLoading(false);
           }
         
           
    }

    const handleLogout=async()=>{
        setLoading(true);
        try {
             const data=logout();
        setUser(null);
        } catch (error) {
            console.error(error);
        }finally{
setLoading(false);
        }
       
        
    }

useEffect(() => {

    const getAndSetUser = async () => {
        try {
            const data = await getMe();

            if (data?.user) {
                setUser(data.user);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();

}, []);
    return {user,loading,handleLogin,handleLogout,handleRegister};
}