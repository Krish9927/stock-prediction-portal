import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Register from './Register'
import Button from './Button'
import { Link } from 'react-router-dom'
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
      <div className="min-h-screen grid place-items-center bg-gray-900">
    <div className="container ">
        <div className="row justify-content-center ">
            <div className="col-md-6 bg-light-dark snake-border p-5 rounded  ">
                <h3 className='text-2xl md:text-3xl font-semibold text-gray-100 text-center mb-6'>
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
                  <div className="flex flex-col items-center gap-3 ">
                       {loading ? (
                        <button type='submit' className='btn btn-info ' ><FontAwesomeIcon icon={faSpinner} spin /> Logging in..</button>
                    )
                    :(
                        <button type='submit' className='btn btn-info  ' >Login</button>
                        
                )}
                <div className="flex items-center gap-1 text-white text-sm">Don't have an account? 
                    <Button text='Register' class='btn-outline-info' url="/register" />
                    <Link className='navbar-brand text-light ' to={'/'}> 
                        <button className='border-4 btn-info '>Home</button></Link>
                </div>
                </div>
                </form>
            </div>
        </div>
    </div>
   </div>
    </>
  )
}

export default Login