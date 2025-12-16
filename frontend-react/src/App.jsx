import { useState } from 'react'
import './assets/css/style.css'
import './App.css'
import Main from './components/Main'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Register from './components/Register'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import AuthProvider from './components/AuthProvider'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoutes from './components/PrivateRoutes'
import PublicRoutes from './components/PublicRoutes'
function App() {

  return (
    <>
    <AuthProvider>
        <BrowserRouter>
    <Header/>
     <Routes>
      <Route path ='/' element={<Main />} />
      <Route path ='/register' element={<PublicRoutes><Register /></PublicRoutes>} />
      <Route path ='/login' element={<PublicRoutes><Login /></PublicRoutes>} />
      <Route path ='/dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>}  />
     </Routes>
      <Footer/>
   </BrowserRouter>
   </AuthProvider>
    </>
  )
}

export default App
