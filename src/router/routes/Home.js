import { lazy } from 'react'

const ContactUs = lazy(() => import('@src/views/main/forms/contactUs/ContactUs'))
const Pricing = lazy(() => import('@src/views/main/products/superLeadz/SuperLeadz/components/PricingPage'))
const SuperLeadzFaq = lazy(() => import('@src/views/main/products/superLeadz/SuperLeadz/components/SuperLeadzFaq'))
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

const Homes_Routes = [

  {
    path: '/',
    element: <Home />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "An end-to-end martech stack for every step of the buyer journey."
  },
  {
    path: '/partners',
    element: <Partner />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Partners: Grow your business"
  },
  {
    path: '/partners/faqs',
    element: <FaqPartner />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Partners FAQ: Grow your business"
  },

  {
    path: '/products/superleadz/lead-generation-nurturing-and-conversion',
    element: <SuperLeadz />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "SuperLeadz: Lead generation, nurturing and conversion"
  },

  {
    path: '/products/superleadz/lead-generation-nurturing-and-conversion/features',
    element: <Features />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Features: Lead generation, nurturing and conversion"
  },
  {
    path: '/products/superleadz/lead-generation-nurturing-and-conversion/pricing',
    element: <Pricing />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Pricing: Lead generation, nurturing and conversion"
  },
  {
    path: '/products/superleadz/lead-generation-nurturing-and-conversion/faqs',
    element: <SuperLeadzFaq />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "FAQ: Lead generation, nurturing and conversion"
  },
  {
    path: '/products/sniper/customer-acquisition/',
    element: <Sniper />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: " Sniper: Customer acquisition"
  },
  {
    path: '/products/infiniti/customer-acquisition-and-loyalty/',
    element: <Infiniti />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Infiniti: Customer acquisition and loyalty"

  },
  {
    path: '/products/semperfi/customer-loyalty/',
    element: <Semper />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Semper Fi: Customer loyalty"
  },
  {
    path: '/contact-us/:type',
    element: <ContactUs />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    }
  },
  {
    path: '/contact-us',
    element: <ContactUs />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Contact us"
  },
  {
    path: '/about-us/why-XIRCLS',
    element: <WhyXircls />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Why XIRCLS : Democratizing Martech for Sustainable Growth."
  },
  {
    path: '/about-us/why-collaborative-marketing/',
    element: <Collab />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Why Collaborative Marketing : Because Life is Collaboration, Not Competition."
  },
  {
    path: '/about-us/vision-&-mission-statement/',
    element: <Vision />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Vision & Mission : To Empower Businesses, Globally"
  },

  // {
  //   path: '/team',
  //   element: <Team />,
  //   meta: {
  //     layout: "homeLayout",
      // publicRoute: true
  //   },
  // title: false
  // },
  {
    path: '/blog',
    element: <Blog />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Blog: News, opinions and perspectives"
  },
  {
    path: '/blog/:blogTitle',
    element: <BlogDetails />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    }
  },
  {
    path: '/blog/author/:blogger',
    element: <Blogger />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    }
  },
  // {
  //   path: '/developers',
  //   element: <Developer />,
  //   meta: {
  //     layout: "homeLayout",
      // publicRoute: true
  //   },
  //   title: false
  // },
  {
    path: '/merchant/login',
    element: <LoginPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Merchant Login"
  },
  {
    path: '/merchant/password_reset',
    element: <ForgetPassword />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Password reset"
  },
  {
    path: '/merchant/signup',
    element: <SignupPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Merchant Signup"
  },
  {
    path: '/affiliate/login',
    element: <AffiliateLoginPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Affiliate Login"
  },
  {
    path: '/affiliate/signup',
    element: <AffiliateSignupPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Affiliate Signup"
  },
  {
    path: '/terms-of-use/',
    element: <TermsPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Terms of Use"
  },
  {
    path: '/privacy-policy/',
    element: <PolicyPage />,
    meta: {
      layout: "homeLayout",
      publicRoute: true
    },
    title: "Privacy Policy"
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
      layout: "custom",
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
  }
]

export default Homes_Routes
