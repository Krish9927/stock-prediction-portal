import React from 'react'
import logoimg from '../assets/images/logo1.png'
import Button from './Button'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <>
    <nav className='navbar container pt-3 pb-3 align-items-start'>

     <Link className='navbar-brand text-light' to="/"> 
        <img src={logoimg} className='d-line-block align-text-top me-2 ' width="60" height="50" alt="" />
        StockForecast</Link>
     <div>
        <Button text='Login' class='btn-outline-info' url="/login"/>
        &nbsp;
        <Button text='Register' class='btn-info' url="/register" />
       
     </div>
    </nav>
    </>
  )
}

export default Header