import { lazy } from 'react'
const Dashboard = lazy(() => import('../../views/dashboard/Dashboard'))
import Affiliate from '../../views/Affiliate/Affiliate'
import InfinitiCustomers from '../../views/Leads/InfinitiCustomer'

const appName = "infiniti"
const Dashboard_Routes = [
  {
    path: '/merchant/dashboard/',
    element: <Dashboard />,
    app: appName,
    permissions: ['Infiniti']
  },
  {
    path: '/merchant/dashboard/affiliate/',
    element: <Affiliate />
  },
  {
    path: '/merchant/Infiniti/customers/',
    element: <InfinitiCustomers />,
    app: appName
  }
]

export default Dashboard_Routes