import { lazy } from 'react'

const ContactUs = lazy(() => import('@src/views/main/forms/contactUs/ContactUs'))
const Superleadz_Pricing = lazy(() => import('@src/views/main/products/superLeadz/SuperLeadz/Superleadz_Pricing'))
const SuperLeadzFaq = lazy(() => import('@src/views/main/products/superLeadz/SuperLeadz/SuperLeadzFaq'))
const Sniper = lazy(() => import('@src/views/main/products/sniper/Sniper'))
const FaqPartner = lazy(() => import('@src/views/main/partner/FaqPartner'))
const Infiniti = lazy(() => import('@src/views/main/products/infiniti/Infiniti'))
const Semper = lazy(() => import('@src/views/main/products/semper/Semper'))

const PolicyPage = lazy(() => import('@src/views/main/utilities/terms/PolicyPage'))

// company
const WhyXircls = lazy(() => import('@src/views/main/company/whyXircls/WhyXircls'))
const TermsPage = lazy(() => import('@src/views/main/utilities/terms/TermsPage'))
const Collab = lazy(() => import('@src/views/main/company/collab/Collab'))
const Blog = lazy(() => import('@src/views/main/company/blog/Blog'))
const BlogDetails = lazy(() => import('@src/views/main/company/blog/BlogDetails'))
const Blogger = lazy(() => import('@src/views/main/company/blog/Blogger'))

// forms
const AffiliateLoginPage = lazy(() => import('../../views/main/forms/affiliateLogin/AffiliateLoginPage'))
const AffiliateSignupPage = lazy(() => import('../../views/main/forms/affiliateLogin/AffiliateSignupPage'))
const LoginPage = lazy(() => import('@src/views/main/forms/Login/LoginPage'))
const ForgetPassword = lazy(() => import('@src/views/main/forms/Login/ForgetPassword'))
const SignupPage = lazy(() => import('@src/views/main/forms/Signup/SignupPage'))

const Developer = lazy(() => import('@src/views/main/developer/Developer'))
const SuperLeadz = lazy(() => import('@src/views/main/products/superLeadz/SuperLeadz/SuperLeadz'))
const Vision = lazy(() => import('@src/views/main/company/vision/Vision'))
const Features = lazy(() => import('@src/views/main/products/superLeadz/features/Features'))
const Team = lazy(() => import('@src/views/main/company/team/Team'))
const Partner = lazy(() => import('@src/views/main/partner/Partner'))
const Home = lazy(() => import('@src/views/main/home/Home'))

const Apps = lazy(() => import('../../views/Apps/Apps'))
const Error = lazy(() => import('../../views/Error'))
const Processing = lazy(() => import('../../views/Flow/Processing'))
const MerchantHome = lazy(() => import('../../views/Apps/Home'))
const FlowLogin = lazy(() => import("../../views/Flow/Login"))
const FlowSignUp = lazy(() => import("../../views/Flow/SignUp"))
import VerfiyYourEmail from '../../views/XirclsFrontend/VerfiyYourAccount'
import InstallFailed from '../../views/XirclsFrontend/InstallFailed'
import Skin_type_form from '../../views/XirclsFrontend/test/Skin_type_form'
import FlashAccount from '../../views/main/products/flash/FlashAccount'
import FaqFlash from '../../views/main/products/flash/FaqFlash'
import Flash_Pricing from '../../views/main/products/flash/Flash_Pricing'
import FlashAccount_Features from '../../views/main/products/flash/FlashAccount_Features'
import SuperLeadzLandingPage from '../../views/main/LandingPage/SuperLeadzLandingPage'
import EmailLists from '../../views/main/LandingPage/EmailLists'
import SuperLeadzOneClickRedemption from '../../views/main/products/superLeadz/SuperLeadz/SuperLeadzOneClickRedemption'
import SuperLeadzLeadGen from '../../views/main/products/superLeadz/SuperLeadz/SuperLeadzLeadGen'
import QRForm from '../../views/main/QR/QRForm'
import CodeUserData from '../../views/codeSkin/CodeUserData'
import CodeUserDetails from '../../views/codeSkin/CodeUserDetails'

const Homes_Routes = [

  {
    path: '/',
    element: <Home />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "An end-to-end martech stack for every step of the buyer journey.",
    trackingTitle: "Home"
  },
  {
    path: '/partners',
    element: <Partner />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Partners - Grow your business",
    trackingTitle: "Partners"
  },
  {
    path: '/partners/faq',
    element: <FaqPartner />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Partners FAQ: Grow your business",
    trackingTitle: "FAQ"
  },

  {
    path: '/products/superleadz/',
    element: <SuperLeadz />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz - Pop-ups for lead generation, nurturing and conversion",
    trackingTitle: "SuperLeadz"
  },

  {
    // path: '/products/superleadz/lead-generation-nurturing-and-conversion/features',
    path: '/products/superleadz/features/',
    element: <Features />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz Features - Pop-ups for lead generation, nurturing and conversion",
    trackingTitle: "SuperLeadz Features"
  },
  {
    // path: '/products/superleadz/lead-generation-nurturing-and-conversion/pricing',
    path: '/products/superleadz/pricing/',
    element: <Superleadz_Pricing />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz Pricing - Pop-ups for lead generation, nurturing and conversion",
    trackingTitle: "SuperLeadz Pricing"
  },
  {
    // path: '/products/superleadz/lead-generation-nurturing-and-conversion/faqs',
    path: '/products/superleadz/faq',
    element: <SuperLeadzFaq />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz FAQ - Pop-ups for lead generation, nurturing and conversion",
    trackingTitle: "SuperLeadz FAQ"
  },
  {
    // path: '/products/sniper/',
    path: '/products/sniper/',
    element: <Sniper />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: " Sniper - Customer acquisition",
    trackingTitle: "Sniper"
  },
  {
    path: '/products/infiniti/',
    // path: '/products/infiniti/',
    element: <Infiniti />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Infiniti - Customer acquisition and loyalty",
    trackingTitle: "Infiniti"
  },
  {
    // path: '/products/semperfi/',
    path: '/products/semperfi/',
    element: <Semper />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Semper Fi - Customer loyalty",
    trackingTitle: "Semper-Fi"
  },
  {
    path: '/products/flash-accounts/',
    element: <FlashAccount />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Flash Accounts",
    trackingTitle: "Flash Accounts"
  },
  {
    path: '/products/flash-accounts/faq/',
    element: <FaqFlash />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Flash Accounts - FAQ",
    trackingTitle: "Flash Accounts FAQ"
  },
  {
    path: '/products/flash-accounts/pricing/',
    element: <Flash_Pricing />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Flash Accounts - Pricing",
    trackingTitle: "Flash Accounts Pricing"
  },
  {
    path: '/products/flash-accounts/features/',
    element: <FlashAccount_Features />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Flash Accounts - Features",
    trackingTitle: "Flash Accounts Features"
  },
  {
    path: '/contact-us/:type',
    element: <ContactUs />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Contact Us"
  },
  {
    path: '/contact-us',
    element: <ContactUs />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Contact us",
    trackingTitle: "Contact Us"
  },
  {
    path: '/about-us/why-XIRCLS',
    element: <WhyXircls />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Why XIRCLS - Democratizing Martech for Sustainable Growth.",
    trackingTitle: "Why Xircls"
  },
  {
    path: '/about-us/why-collaborative-marketing/',
    element: <Collab />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Why Collaborative Marketing - Because Life is Collaboration, Not Competition.",
    trackingTitle: "Why Collaborative Marketing"
  },
  {
    path: '/about-us/vision-&-mission-statement/',
    element: <Vision />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Vision & Mission - To Empower Businesses, Globally",
    trackingTitle: "Vission & mission statement"
  },

  // {
  // path: '/team',
  // element: <Team />,
  // meta: {
  // layout: "homeLayout",
  // publicRoute: true
  // },
  // title: false
  // },
  {
    path: '/blog',
    element: <Blog />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Blog: News, opinions and perspectives",
    trackingTitle: "Blog"
  },
  // {
  // path: '/blog/:blogTitle',
  // element: <BlogDetails />,
  // meta: {
  // layout: "homeLayout",
  // publicRoute: true
  // }
  // },
  {
    path: '/blog/Conflict-Torture-or-Tool/',
    element: <BlogDetails blogTitle={"Conflict-Torture-or-Tool"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Conflict Torture or Tool"
  },
  {
    path: '/blog/Collaborative-Marketing-and-the-Future-of-ZeroParty-Data/',
    element: <BlogDetails blogTitle={"Collaborative-Marketing-and-the-Future-of-ZeroParty-Data"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Collaborative Marketing and the Future of ZeroParty Data"
  },
  {
    path: '/blog/Why-Companies-Need-to-Move-From-Diversity-To-Inclusion/',
    element: <BlogDetails blogTitle={"Why-Companies-Need-to-Move-From-Diversity-To-Inclusion"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Why Companies Need to Move From Diversity To Inclusion"
  },
  {
    path: '/blog/Target-Audience-Are-Companies-At-War-With-Their-Customers/',
    element: <BlogDetails blogTitle={"Target-Audience-Are-Companies-At-War-With-Their-Customers"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Target Audience Are Companies At War With Their Customers"
  },
  {
    path: '/blog/Current-Online-Marketing-Practices-Are-Making-You-Pay-More/',
    element: <BlogDetails blogTitle={"Current-Online-Marketing-Practices-Are-Making-You-Pay-More"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Current Online Marketing Practices Are Making You Pay More"
  },
  {
    path: '/blog/Are-Bargain-Hunters-Killing-Your-Business/',
    element: <BlogDetails blogTitle={"Are-Bargain-Hunters-Killing-Your-Business"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Are Bargain Hunters Killing Your Business"
  },
  {
    path: '/blog/Mind-Games-Why-We-Buy-What-We-Buy/',
    element: <BlogDetails blogTitle={"Mind-Games-Why-We-Buy-What-We-Buy"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Mind Games Why We Buy What We Buy"
  },
  {
    path: '/blog/Are-Influencers-Worth-The-Price-Tag/',
    element: <BlogDetails blogTitle={"Are-Influencers-Worth-The-Price-Tag"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Are Influencers Worth The Price Tag"

  },
  {
    path: '/blog/The-Harsh-Truth-About-Customer-Loyalty-Programs/',
    element: <BlogDetails blogTitle={"The-Harsh-Truth-About-Customer-Loyalty-Programs"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog The Harsh Truth About Customer Loyalty Programs"
  },
  {
    path: '/blog/Playing-With-Power-The-Danger-Of-Monopolies/',
    element: <BlogDetails blogTitle={"Playing-With-Power-The-Danger-Of-Monopolies"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Playing With Power The Danger Of Monopolies"
  },
  {
    path: '/blog/The-Devils-Currency-Our-Lives-For-Auction/',
    element: <BlogDetails blogTitle={"The-Devils-Currency-Our-Lives-For-Auction"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog The Devils Currency Our Lives For Auction"
  },
  // {
  // path: '/blog/author/:blogger',
  // element: <Blogger />,
  // meta: {
  // layout: "homeLayout",
  // publicRoute: true
  // }
  // },
  {
    path: '/blog/author/Darina_Litvina/',
    element: <Blogger blogger={"Darina_Litvina"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Darina Litvina"
  },
  {
    path: '/blog/author/Ian_White/',
    element: <Blogger blogger={"Ian_White"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Ian White"
  },
  {
    path: '/blog/author/Shakercha_Bradshaw/',
    element: <Blogger blogger={"Shakercha_Bradshaw"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Shakercha Bradshaw"
  },
  {
    path: '/blog/author/Adriana_Marcela_Torrenegra/',
    element: <Blogger blogger={"Adriana_Marcela_Torrenegra"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Adriana Marcela Torrenegra"
  },
  {
    path: '/blog/author/Lauren_Deah/',
    element: <Blogger blogger={"Lauren_Deah"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Lauren Deah"
  },
  {
    path: '/blog/author/Kwanele_Ngobese/',
    element: <Blogger blogger={"Kwanele_Ngobese"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Kwanele Ngobese"
  },
  {
    path: '/blog/author/Allie_Hinds/',
    element: <Blogger blogger={"Allie_Hinds"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Allie Hinds"
  },
  {
    path: '/blog/author/Peyton-Sweeney/',
    element: <Blogger blogger={"Peyton-Sweeney"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Peyton Sweeney"
  },
  {
    path: '/blog/author/Dineo-Magakwa/',
    element: <Blogger blogger={"Dineo-Magakwa"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Dineo Magakwa"
  },
  {
    path: '/blog/author/Lauren_Deah/',
    element: <Blogger blogger={"Lauren_Deah"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Lauren Deah"
  },
  {
    path: '/blog/author/Allie_Hinds/',
    element: <Blogger blogger={"Allie_Hinds"} />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    trackingTitle: "Blog Author Lauren Deah"
  },
  // {
  // path: '/developers',
  // element: <Developer />,
  // meta: {
  // layout: "homeLayout",
  // publicRoute: true
  // },
  // title: false
  // },
  {
    path: '/merchant/login',
    element: <LoginPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Merchant Login",
    trackingTitle: "Merchant Login"
  },
  {
    path: '/merchant/password_reset',
    element: <ForgetPassword />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Password reset",
    trackingTitle: "Password reset"
  },
  {
    path: '/merchant/signup',
    element: <SignupPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Merchant Signup",
    trackingTitle: "Merchant Signup"
  },
  {
    path: '/affiliate/login',
    element: <AffiliateLoginPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Affiliate Login",
    trackingTitle: "Affiliate Login"
  },
  {
    path: '/affiliate/signup',
    element: <AffiliateSignupPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Affiliate Signup",
    trackingTitle: "Affiliate Signup"
  },
  {
    path: '/terms-of-use/',
    element: <TermsPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Terms of Use",
    trackingTitle: "Terms of Use"
  },
  {
    path: '/privacy-policy/',
    element: <PolicyPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Privacy Policy",
    trackingTitle: "Privacy Policy"
  },
  {
    path: '/merchant/home/',
    element: <MerchantHome />
  },
  {
    path: '/merchant/apps/',
    element: <Apps />
  },
  {
    path: '*',
    element: <Error />,
    meta: {
      layout: "custom",
      publicRoute: true
    }
  },
  {
    path: '/processing/',
    element: <Processing />,
    meta: {
      layout: "custom",
      publicRoute: true
    }
  },
  {
    path: '/:flow/signup/',
    element: <FlowSignUp />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    }
  },
  {
    path: '/flow/login/',
    element: <FlowLogin />,
    meta: {
      layout: "custom",
      publicRoute: true
    }
  },
  {
    path: '/merchant/verify-your-email/:slug/',
    element: <VerfiyYourEmail />,
    meta: {
      layout: 'custom',
      publicRoute: true
    }
  },
  {
    path: '/install_flow_failed/',
    element: <InstallFailed />,
    meta: {
      layout: 'custom',
      publicRoute: true
    }
  },
  {
    path: '/codeskin/skin-type-test',
    element: <Skin_type_form />,
    meta: {
      layout: "NewBlank",
      publicRoute: true
    }
  },
  {
    path: '/products/superleadz/build-email-lists-verified-leads',
    element: <EmailLists />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz - Build email lists of verified leads",
    trackingTitle: "SuperLeadz - Build email lists of verified leads"
  },
  {
    path: "/products/superleadz/one-click-offer-redemption/",
    element: <SuperLeadzOneClickRedemption />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz - One-click Offer Redemption",
    trackingTitle: "SuperLeadz - One-click Offer Redemption"
  },
  {
    path: "/products/superleadz/dual-verification-qualified-lead-generation/",
    element: <SuperLeadzLeadGen />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz - Dual Verification Process",
    trackingTitle: "SuperLeadz - Dual Verification Process"
  },
  {
    path: "/qr/:id/",
    element: <QRForm />,
    meta: {
      layout: "custom",
      publicRoute: true
    }
  },
  {
    path: '/merchant/qrcode/reports/:id',
    element: <CodeUserData />
  },
  {
    path: '/merchant/qrcode/report_detail/:id',
    element: <CodeUserDetails />
  }
]

export default Homes_Routes