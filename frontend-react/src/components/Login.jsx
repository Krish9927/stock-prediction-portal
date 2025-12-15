import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

const Login = () => {
const[username,SetUsername] =useState('')
const[password,SetPassword]=useState('')
const[loading,setLoading]=useState(false)
const[error,setErrors] =useState('')
const  navigate =useNavigate()
const {isLoggedIN,setIsLoggedIn} = useContext(AuthContext)

   const handleLogin= async(e)=>{
    e.preventDefault();
    setLoading(true)
    const userData = {username,password};
  // console.log('userData==>',userData);
  
  try{
    const response = await axios.post('http://127.0.0.1:8000/api/v1/token/',userData)
    // console.log(response.data);
    localStorage.setItem('accessToken',response.data.access)
    localStorage.setItem('refreshToken',response.data.refresh)
    setIsLoggedIn(true)
    navigate('/')
    console.log('Login Successful');
    
     }catch(error){
        console.log('Invalid Crednitail');
        setErrors('Invalid Credential')
     }finally{
      setLoading(false)
     }
   }
  return (
      <>
    <div className="container ">
        <div className="row justify-content-center">
            <div className="col-md-6 bg-light-dark snake-border p-5 rounded">
                <h3 className='text-light text-center mb-4'>
                    Login 
                </h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                    <input type="text" className='form-control ' placeholder='Enter UserName' value={username} onChange={(e)=>SetUsername(e.target.value)}/>
                   
                    </div>
                    <div className="mb-3">
                         <input type="password" className='form-control ' placeholder='Enter Password' value={password} onChange={(e)=>SetPassword(e.target.value)}/>
                
                    </div>
                   {error && <div className='text-danger'>{error}</div> }
                   
                    {/* {loading && <div className="alert alert-warning"> Loading </div> } */}
                    {loading ? (
                        <button type='submit' className='btn btn-info d-block mx-auto' ><FontAwesomeIcon icon={faSpinner} spin /> Logging in..</button>
                    )
                    :(
                        <button type='submit' className='btn btn-info d-block mx-auto' >Login</button>
                        
                )}
                </form>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login