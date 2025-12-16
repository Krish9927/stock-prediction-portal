import { useContext} from 'react'
import { AuthContext } from './AuthProvider'
import { Navigate } from 'react-router-dom'
const PublicRoutes = ({children}) => {
    const {isLoggedIN}=useContext(AuthContext)
  return  !isLoggedIN ?(
    children
  ):(
    <Navigate to='/dashboard' />
  )
}

export default PublicRoutes