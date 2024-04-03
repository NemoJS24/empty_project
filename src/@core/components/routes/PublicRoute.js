// ** React Imports
import { Suspense, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'
import { useAnalyticsPageViewTracker } from '@src/views/Validator'

const PublicRoute = ({ children, route }) => {
  const location = useLocation()
  if (route) {
    const user = getUserData()

    const restrictedRoute = route.meta && route.meta.restricted

    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />
    }
  }

  useEffect(() => {
    if (route?.trackingTitle) {
      console.log(route, "route")
      useAnalyticsPageViewTracker(route?.trackingTitle, location.pathname)
    }
  }, [location.pathname])

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
