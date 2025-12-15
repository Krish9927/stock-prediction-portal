import {useState,useContext, createContext} from 'react'
//create context
const AuthContext = createContext();

    const AuthProvider=({children})=>{
      const[isLoggedIN,setIsLoggedIn]=useState(
        !!localStorage.getItem('accessToken')//here !! is 
      )
  return (
  <>
  <AuthContext.Provider value = {{isLoggedIN,setIsLoggedIn}} >
    {children}
  </AuthContext.Provider>
  </>
  )
}

export default AuthProvider
export {AuthContext};