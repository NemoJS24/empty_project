// ** React Imports
// import { Outlet } from 'react-router-dom'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../assets/main.css"

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Components
import classnames from 'classnames'
import Navbar from '@src/views/main/utilities/navbar/Navbar'
import { Container } from 'reactstrap'
import SubNavbar from '@src/views/main/utilities/navbar/SubNavbar'
import Homes_Routes from '../../router/routes/Home'
import axios from 'axios'
import { baseURL } from '../../assets/auth/jwtService'

const HomeLayout = () => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [isDifferent, setisDifferent] = useState(false)
  const [SecondNavbar, setSecondNavbar] = useState(false)
  const [BackbtnFlag, setBackbtnFlag] = useState(false)
  const [visibleMenu, setVisibleMenu] = useState(true)

  const { pathname } = useLocation()
  // ** Hooks
  const { skin } = useSkin()

  // console.log(pathname)

  const NavbarFun = () => {
    const list = ['/partners/', '/partners', '/partners/faq/', '/partners/faq', '/products/superleadz/', '/products/superleadz', '/products/superleadz/features/', '/products/superleadz/features', '/products/superleadz/pricing/', '/products/superleadz/pricing', '/products/superleadz/faq/', '/products/superleadz/faq', '/products/flash-accounts/', '/products/flash-accounts', '/products/flash-accounts/faq/', '/products/flash-accounts/faq', '/products/flash-accounts/pricing/', '/products/flash-accounts/pricing', '/products/flash-accounts/features/', '/products/flash-accounts/features', '/products/superleadz/build-email-lists-verified-leads', '/products/superleadz/one-click-offer-redemption/', '/products/superleadz/dual-verification-qualified-lead-generation/']
    if (list.includes(pathname)) {
      setisDifferent(true)
      if (pathname.includes("partners")) {
        setSecondNavbar("partners")
      } else if (pathname.includes("superleadz")) {
        setSecondNavbar("superleadz")
      } else if (pathname.includes("flash-accounts")) {
        setSecondNavbar("flash-accounts")
      } else {
        setSecondNavbar(false)
      }
    } else {
      setisDifferent(false)
      // console.log(false)
    }
  }

  const ScrollEffect = () => {
    const handleHistoryChange = () => {
      setBackbtnFlag(true)
    }

    // Attach the event listener for back button click
    window.addEventListener('popstate', handleHistoryChange)

    // Clean up the event listener when the component unmounts
    if (!BackbtnFlag) {
      window.scroll(0, 0)
    }
    if (BackbtnFlag) {
      setBackbtnFlag(false)
    }

    return () => {
      window.removeEventListener('popstate', handleHistoryChange)
      setBackbtnFlag(false)

    }
  }

  const urls = [...Homes_Routes]
  useEffect(() => {
    setIsMounted(true)

    NavbarFun()
    ScrollEffect()

    for (const route of urls) {
      if (route.path === pathname) {
        if (route.title) {
          document.title = route.title
        } else {
          document.title = "XIRCLS"
        }
        break // Stop the loop once a match is found.
      }
    }
    return () => setIsMounted(false)

  }, [pathname])

  useEffect(() => {
    const list = []
    axios({
      method: "GET",
      url: `${baseURL}/merchant/all_apps/`
    })
      .then((data) => {
        // console.log("all_apps hahaha", data)
        data.data.forEach(element => {
          list.push(`/${element.slug.toLowerCase()}/signup/`)
          list.push(`/${element.slug.toLowerCase()}/signup`)
          // console.log({ list })
        })
      })
      .catch((err) => {
        console.log("all_apps", err)
      })
      .finally(() => {
        if (!list.includes(pathname)) {
          setisDifferent(true)
          // console.log(true)
          setVisibleMenu(false)
        } else {
          setisDifferent(false)
          // console.log(false)
          setVisibleMenu(true)
        }
      })
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames('blank-page', {
        'dark-layout': skin === 'dark'
      })}
    >
      <div className='app-content content'>
        <div className='content-wrapper'>
          {/* xircls_frontend */}
          {
            <div className='content-body customeHomeDiv'>
              <Container fluid="lg" className='border p-0 overflow-hidden'>
                {
                  isDifferent ? <Navbar position={'notFixed'} /> : <Navbar hideMenu={visibleMenu} />
                }
                {
                  isDifferent && SecondNavbar && <SubNavbar navTitle={SecondNavbar} />
                }

                <Outlet />

                {/* <Footer /> */}
              </Container>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
