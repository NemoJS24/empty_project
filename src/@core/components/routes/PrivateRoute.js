// ** React Imports
import { Navigate } from 'react-router-dom'
import { Suspense } from 'react'
// import { TOKEN_KEY, getToken } from '../../../assets/auth/auth'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
// import Cookies from 'js-cookie'

// ** Context Imports
// import { AbilityContext } from '@src/utility/context/Can'

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  // const ability = useContext(AbilityContext)
  const user = Cookies.get("xircls_user_token")

  if (route) {
    // let action = null
    // let resource = null
    // let restrictedRoute = false

    // if (route.meta) {
    //   action = route.meta.action
    //   resource = route.meta.resource
    //   restrictedRoute = route.meta.restricted
    // }
    if (!user) {
      toast.error("Session expired. Please login")
      return <Navigate to='/merchant/login/' />
    }
    // if (user && restrictedRoute) {
    //   return <Navigate to='/' />
    // }
    // if (user && restrictedRoute && user.role === 'client') {
    //   return <Navigate to='/access-control' />
    // }
    // if (user && !ability.can(action || 'read', resource)) {
    //   return <Navigate to='/misc/not-authorized' replace />
    // }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PrivateRoute
