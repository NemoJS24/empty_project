// ** React Imports
import { Outlet } from 'react-router-dom'
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import { PermissionProvider } from '../Helper/Context'
import { useContext } from 'react'
// import { CRMNavigation } from '../navigation/Apps/CRM'
// import { DefaultNav } from '../navigation/Apps/DefualtNav'
import { SuperLeadzNavigation } from '../navigation/Apps/SuperLeadz'
import { InfinitiNavigation } from '../navigation/Apps/Infiniti'
import { referralNavigation } from '../navigation/Apps/Referral'
import { flashAccountsNavigation } from '../navigation/Apps/FlashAccounts'
// import { useContext } from 'react'
// import { PermissionProvider } from '../Helper/Context'
import { DefaultNav, FooterNav } from '../navigation/Apps/DefualtNav'
import { ProductReviewNavigation } from '../navigation/Apps/ProductReview'
import { OhMyCustomerNavigation } from '../navigation/Apps/OhMyCustomer'
import { CRMNavigation } from '../navigation/Apps/CRM'
import { WhatsappNavigation } from '../navigation/Apps/Whatsapp'
import { EmailNavigation } from '../navigation/Apps/Email'
// import { getNavbar } from '../views/Validator'

// ** Menu Items Array
// import navigation from '@src/navigation/vertical'

const VerticalLayout = props => {

  const { userPermission } = useContext(PermissionProvider)
console.log(userPermission)
  let navigation = []

  if (userPermission?.appName === "superleadz") {
    navigation = [...SuperLeadzNavigation, ...FooterNav]
  } else if (userPermission?.appName === "infiniti") {
    navigation = [...InfinitiNavigation, ...FooterNav]
  } else if (userPermission?.appName === "referral") {
    navigation = [...referralNavigation, ...FooterNav]
  } else if (userPermission?.appName === "flash_accounts") {
    navigation = [...flashAccountsNavigation, ...FooterNav]
  } else if (userPermission?.appName === "product_review") {
    navigation = [...ProductReviewNavigation, ...FooterNav]
  } else if (userPermission?.appName === "crm") {
    navigation = [...CRMNavigation, ...FooterNav]
  } else if (userPermission?.appName === "whatsapp") {
    navigation = [...WhatsappNavigation, ...FooterNav]
  } else if (userPermission?.appName === "email") {
    navigation = [...EmailNavigation, ...FooterNav]
  } else {
    navigation = DefaultNav
  }

  return (
    <Layout menuData={navigation} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
