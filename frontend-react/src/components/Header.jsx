import React, { useContext } from 'react'
import logoimg from '../assets/images/logo1.png'
import Button from './Button'
import { Link,useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'


const Header = () => {
  const {isLoggedIN,setIsLoggedIn}=useContext(AuthContext)
  const navigate = useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    console.log('Logged out');
    navigate('/login')
    
  }
  return (
    <>
    <nav className=' navbar container pt-3 pb-3 align-items-start'>
       <div className="flex flex-col md:flex-row gap-0">
     <Link className='navbar-brand text-light ' to={'/'}> 
       <div> <img srcSet={logoimg} className='d-line-block align-text-top me-2 bg-amber-50' width="60" height="50" alt=""  /></div>
        <p>StockForecast</p></Link>
</div>
     <div>
      {isLoggedIN ?(
        <>
         <Button text='Dashboard' class='btn-info' url="/dashboard" />
         &nbsp;
        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </>
      ):(
        <>
         <Button text='Login' class='btn-outline-info' url="/login"/>
        &nbsp;
        <Button text='Register' class='btn-info' url="/register" />
        </>
      )}
     </div>
    </nav>
    </>
  )
}

export default Header