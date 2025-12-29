import React, { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Button from './Button'
const Register = () => {
    const[username,SetUsername]=useState('')
    const[email,SetEmail]=useState('')
    const[password,SetPassword]=useState('')
    const[errors,setErrors]=useState({})
    const[success,setSuccess]=useState(false)
    const[loading,setLoading]=useState(false)
    const handleRegistration= async(e) =>{
       e.preventDefault();
       setLoading(true);
        const userData ={
            username,email,password
        }
        try{
         const response =  await axios.post('http://127.0.0.1:8000/api/v1/register/',userData)
         console.log('response.data',response.data);
         console.log('Registration Successful');
         setErrors({})
         setSuccess(true)
        }catch(error){
            setErrors(error.response.data)
          console.log('Registration Error',error.response.data);
          
        }finally{
            setLoading(false)
        }     
    }
  return (
    <>
    
      <div className="min-h-screen grid place-items-center bg-gray-900">
    <div className="container ">
        <div className="row justify-content-center">
            <div className="col-md-6 bg-light-dark snake-border p-5 rounded">
                <h3 className='text-2xl md:text-3xl font-semibold text-gray-100 text-center mb-6'>
                    Create an Account
                </h3>
                <form onSubmit={handleRegistration}>
                    <div className="mb-3">
                    <input type="text" className='form-control ' placeholder='Enter UserName' value={username} onChange={(e)=>SetUsername(e.target.value)}/>
                    <small>{errors.username && <div className='text-danger'>{errors.username}</div>}</small>
                    </div>
                    <div className="mb-3">
                            <input type="email" className='form-control ' placeholder='Enter EmailAddress' value={email} onChange={(e)=>SetEmail(e.target.value)}/>
                    <small>{errors.email && <div className="text-danger">{errors.email}</div> }</small>
                    </div>
                    <div className="mb-3">
                         <input type="password" className='form-control ' placeholder='Set Password' value={password} onChange={(e)=>SetPassword(e.target.value)}/>
                    <small>{errors.password && <div className="text-danger ">{errors.password}</div> }</small>
                    </div>
                   
                    {success && <div className="alert alert-success"> Registration SuccessFul</div> }
                   <div className="flex flex-col items-center gap-3">
                    {/* {loading && <div className="alert alert-warning"> Loading </div> } */}
                    {loading ? (
                        <button type='submit' className='btn btn-info d-block mx-auto' ><FontAwesomeIcon icon={faSpinner} spin /> Please Wait...</button>
                    )
                    :(
                        <button type='submit' className='btn btn-info d-block mx-auto' >Register</button>
                        
                )}
                 <div className="flex items-center gap-1 text-white text-sm">Have an account? 
                    <Button text='Login' class='btn-outline-info' url="/login" />
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

export default Register