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

const HomeLayout = () => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [isDifferent, setisDifferent] = useState(false)
  const [SecondNavbar, setSecondNavbar] = useState(false)
  const [BackbtnFlag, setBackbtnFlag] = useState(false)

  const { pathname } = useLocation()
  // ** Hooks
  const { skin } = useSkin()

  // console.log(pathname)

  const NavbarFun = () => {
    const list = ['/partners', '/partners/faqs', '/products/superleadz/lead-generation-nurturing-and-conversion', '/products/superleadz/lead-generation-nurturing-and-conversion/features', '/products/superleadz/lead-generation-nurturing-and-conversion/pricing', '/products/superleadz/lead-generation-nurturing-and-conversion/faqs']
    if (list.includes(pathname)) {
      setisDifferent(true)
      // console.log(true)
      if (pathname.includes("partners")) {
        setSecondNavbar("partners")
      } else if (pathname.includes("superleadz")) {
        setSecondNavbar("superleadz")
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
              <Container fluid="sm" className='border p-0 overflow-hidden'>
                {
                  isDifferent ? <Navbar position={'notFixed'} /> : <Navbar />
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
