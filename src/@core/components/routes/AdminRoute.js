// ** React Imports
import { Suspense, useContext } from 'react'
import { Navigate } from 'react-router-dom'

// ** Utils
import { getUserPermission } from '../../../assets/auth/auth'
import { PermissionProvider } from '../../../Helper/Context'

const AdminRoute = ({ children, route }) => {
  const { userPermission } = useContext(PermissionProvider)
  if (route) {
    const user = getUserPermission() ? JSON.parse(getUserPermission()) : userPermission.isAdmin ? userPermission : {}
    // console.log(user, "user", getUserPermission())
    // const restrictedRoute = route.meta && route.meta.restricted

    if (!user?.isAdmin) {
      return <Navigate to={"/admin/"} />
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default AdminRoute
