// ** React Imports
import { Navigate, useNavigate } from 'react-router-dom'
import { Suspense } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { getToken } from '../../../assets/auth/auth'

const PrivateRoute = ({ children, route }) => {

  const navigate = useNavigate()

  const checkUserToken = async () => {
    const token = await getToken() ? JSON.parse(getToken()) : null
    // console.log(token, "useruser")
    if (!token) {
      toast.error("Session expired. Please login")
      navigate('/merchant/login/')
    }
  }
  // useEffect(() => {
  if (route) {
    checkUserToken()
  }
  return <Suspense fallback={null}>{children}</Suspense>
}

export default PrivateRoute
