import { useState } from 'react'
import './assets/css/style.css'
import './App.css'
import Main from './components/Main'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import AuthProvider from './components/AuthProvider'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoutes from './components/PrivateRoutes'
import PublicRoutes from './components/PublicRoutes'
import MainLayout from './components/MainLayout'
import AuthLayout from './components/AuthLayout'
function App() {

  return (
    <>
    <AuthProvider>
        <BrowserRouter>
     <Routes>
       <Route element={<MainLayout />}>
      <Route path ='/' element={<Main />} />
      <Route path ='/dashboard' element={<PrivateRoutes><Dashboard /></PrivateRoutes>}  />
      </Route>
       <Route element={<AuthLayout />}>
      <Route path ='/register' element={<PublicRoutes><Register /></PublicRoutes>} />
      <Route path ='/login' element={<PublicRoutes><Login /></PublicRoutes>} />
      </Route>
     </Routes>

   </BrowserRouter>
   </AuthProvider>
    </>
  )
}

export default App
