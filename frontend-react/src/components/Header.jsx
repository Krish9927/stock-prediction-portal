import React from 'react'
import logoimg from '../assets/images/logo1.png'
import Button from './Button'
const Header = () => {
  return (
    <>
    <nav className='navbar container pt-3 pb-3 align-items-start'>

     <a className='navbar-brand text-light'> 
        <img src={logoimg} className='d-line-block align-text-top me-2 ' width="60" height="50" alt="" />
        StockForecast</a>
     <div>
        <Button text='Login' class='btn-outline-info'/>
        &nbsp;
        <Button text='Register' class='btn-info' />
       
     </div>
    </nav>
    </>
  )
}

export default Header