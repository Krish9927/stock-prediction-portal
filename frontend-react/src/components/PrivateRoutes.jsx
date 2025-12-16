import { useContext} from 'react'
import { AuthContext } from './AuthProvider'
import { Navigate } from 'react-router-dom'
const PrivateRoutes = ({children}) => {
    const {isLoggedIN}=useContext(AuthContext)
  return isLoggedIN ? (
    children
  ):(
    <Navigate to='/login' />
  )
}

export default PrivateRoutes