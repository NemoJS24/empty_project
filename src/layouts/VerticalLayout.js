// ** React Imports
import { Outlet } from 'react-router-dom'
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import { SuperLeadzNavigation } from '../navigation/Apps/SuperLeadz'
import { InfinitiNavigation } from '../navigation/Apps/Infiniti'
import { referralNavigation } from '../navigation/Apps/Referral'
import { flashAccountsNavigation } from '../navigation/Apps/FlashAccounts'
import { useContext } from 'react'
import { PermissionProvider } from '../Helper/Context'
import { DefaultNav } from '../navigation/Apps/DefualtNav'
import { ProductReviewNavigation } from '../navigation/Apps/ProductReview'
import { OhMyCustomerNavigation } from '../navigation/Apps/OhMyCustomer'

// ** Menu Items Array
// import navigation from '@src/navigation/vertical'

const VerticalLayout = props => {

  const { userPermission } = useContext(PermissionProvider)

  // let navigation = []

  const getAppMenu = () => {
    if (userPermission?.appName === "superleadz") {
      return SuperLeadzNavigation
    } else if (userPermission?.appName === "infiniti") {
      return InfinitiNavigation
    } else if (userPermission?.appName === "referral") {
      return referralNavigation
    } else if (userPermission?.appName === "flash_accounts") {
      return flashAccountsNavigation
    } else if (userPermission?.appName === "product_review") {
      return ProductReviewNavigation
    } else if (userPermission?.appName === "oh_my_customer") {
      return OhMyCustomerNavigation
    } else {
      return DefaultNav
    }
  }

  return (
    <Layout menuData={getAppMenu()} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
