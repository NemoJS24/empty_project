// ** React Imports
// import { Outlet } from 'react-router-dom'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy } from 'react'
import "../assets/main.css"

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Components
import classnames from 'classnames'
import axios from 'axios'
import { baseURL } from '../../assets/auth/jwtService'
const Header = lazy(() => import('../../views/XirclsFrontend/base/Header'))

const BlankLayout = () => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [isDifferent, setisDifferent] = useState(false)
  const { pathname } = useLocation()
  // ** Hooks
  const { skin } = useSkin()

  // console.log(pathname)

  useEffect(() => {
    setIsMounted(true)
    const list = ['/new_signup/new_mode/', 'select-outlet', '/select_product/', '/outlet_details/', '/create_offers/', '/new_signup/', "/new_login/", "/plan_pricing/1/", "/merchant/SuperLeadz/intro/", "/merchant/SuperLeadz/TheAudience/", "/merchant/SuperLeadz/Editbutton/", '/merchant/SuperLeadz/Thebutton/', '/merchant/SuperLeadz/discount/', '/merchant/SuperLeadz/joinus/']
    axios({
      method: "GET",
      url: `${baseURL}/merchant/all_apps/`
    })
    .then((data) => {
      // console.log("all_apps", data)
      data.data.forEach(element => {
        list.push(`/${element.slug}/signup`)
        list.push(`/${element.slug}/signup`)
      })
    })
    .catch((err) => {
      console.log("all_apps", err)
    })

    // console.log({list})
    if (list.includes(pathname)) {
      setisDifferent(true)
      // console.log(true)
    } else {
      setisDifferent(false)
      // console.log(false)
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
        <div className={`content-wrapper ${!isDifferent ? 'xircls_frontend' : 'new_frontend' }`}>
         {/* xircls_frontend */}
            {
              !isDifferent ? <div className='content-body'>
                  <Header /> 
                <Outlet /> 
                </div> : <div className='content-body'>
                  <Outlet /> 
                </div>
            }
          {/* <Header />
              <Outlet /> 
            <Footer /> */}
            {/* <Outlet /> */}
        </div>
      </div>
    </div>
  )
}

export default BlankLayout
