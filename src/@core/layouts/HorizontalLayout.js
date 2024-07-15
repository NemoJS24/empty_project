// ** React Imports
import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { handleMenuHidden, handleContentWidth } from '@store/layout'

// ** Third Party Components
import classnames from 'classnames'
import { ArrowUp } from 'react-feather'

// ** Reactstrap Imports
import { Navbar, NavItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'

// ** Configs
import themeConfig from '@configs/themeConfig'

// ** Custom Components

import Customizer from '@components/customizer'
import ScrollToTop from '@components/scrolltop'
import NavbarComponent from './components/navbar'
import MenuComponent from './components/menu/horizontal-menu'

// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
import { useSkin } from '@hooks/useSkin'
import { useLayout } from '@hooks/useLayout'
import { useNavbarType } from '@hooks/useNavbarType'
import { useFooterType } from '@hooks/useFooterType'
import { useNavbarColor } from '@hooks/useNavbarColor'
import { useRouterTransition } from '@hooks/useRouterTransition'

// ** Styles
import '@styles/base/core/menu/menu-types/horizontal-menu.scss'
import CreateSupportTicket from '../../views/SuperLeadz/CreateSupportTicket'
import { PermissionProvider } from '../../Helper/Context'

const HorizontalLayout = props => {
  // ** Props
  const { navbar, menuData, children, menu } = props

  // ** Hooks
  const { skin, setSkin } = useSkin()
  const [isRtl, setIsRtl] = useRTL()
  const { navbarType, setNavbarType } = useNavbarType()
  const { footerType, setFooterType } = useFooterType()
  const { navbarColor, setNavbarColor } = useNavbarColor()
  const { layout, setLayout, setLastLayout } = useLayout()
  const { transition, setTransition } = useRouterTransition()
  const [bug, setBug] = useState(false)
  const { userPermission } = useContext(PermissionProvider)

  // ** States
  const [isMounted, setIsMounted] = useState(false)
  const [navbarScrolled, setNavbarScrolled] = useState(false)

  // ** Store Vars
  const dispatch = useDispatch()
  const layoutStore = useSelector(state => state.layout)

  // ** Vars
  const contentWidth = layoutStore.contentWidth
  const isHidden = layoutStore.menuHidden

  // ** Handles Content Width
  const setContentWidth = val => dispatch(handleContentWidth(val))

  // ** Handles Content Width
  const setIsHidden = val => dispatch(handleMenuHidden(val))

  // ** UseEffect Cleanup
  const cleanup = () => {
    setIsMounted(false)
    setNavbarScrolled(false)
  }

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true)
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 65 && navbarScrolled === false) {
        setNavbarScrolled(true)
      }
      if (window.pageYOffset < 65) {
        setNavbarScrolled(false)
      }
    })
    return () => cleanup()
  }, [])

  // ** Vars
  const footerClasses = {
    static: 'footer-static',
    sticky: 'footer-fixed',
    hidden: 'footer-hidden'
  }

  const navbarWrapperClasses = {
    floating: 'navbar-floating',
    sticky: 'navbar-sticky',
    static: 'navbar-static'
  }

  const navbarClasses = {
    floating: contentWidth === 'boxed' ? 'floating-nav container-xxl' : 'floating-nav',
    sticky: 'fixed-top'
  }

  const bgColorCondition = navbarColor !== '' && navbarColor !== 'light' && navbarColor !== 'white'

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={classnames(
        `wrapper horizontal-layout horizontal-menu ${navbarWrapperClasses[navbarType] || 'navbar-floating'} ${
          footerClasses[footerType] || 'footer-static'
        } menu-expanded`
      )}
      {...(isHidden ? { 'data-col': '1-column' } : {})}
    >
      <style>
        {`
          .custom_header .btn-close {
            transform: translate(15px, -25px) !important;
          }
        `}
      </style>
      <Navbar
        expand='lg'
        container={false}
        className={classnames('header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center', {
          'navbar-scrolled': navbarScrolled
        })}
      >
        {!navbar && (
          <div className='navbar-header d-xl-block d-none'>
            <ul className='nav navbar-nav'>
              <NavItem>
                <Link to='/merchant/home/' className='navbar-brand'>
                  <span className='brand-logo'>
                    <img src={themeConfig.app.appLogoImage} alt='logo' />
                  </span>
                  <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>
                </Link>
              </NavItem>
            </ul>
          </div>
        )}

        <div className='navbar-container d-flex content'>
          {navbar ? navbar({ skin, setSkin }) : <NavbarComponent skin={skin} setSkin={setSkin} />}
        </div>
      </Navbar>
      {!isHidden ? (
        <div className='horizontal-menu-wrapper'>
          <Navbar
            tag='div'
            expand='sm'
            light={skin !== 'dark'}
            dark={skin === 'dark' || bgColorCondition}
            className={classnames(`header-navbar navbar-horizontal navbar-shadow menu-border`, {
              [navbarClasses[navbarType]]: navbarType !== 'static',
              'floating-nav': (!navbarClasses[navbarType] && navbarType !== 'static') || navbarType === 'floating'
            })}
          >
            {menu ? menu({ menuData, routerProps, currentActiveItem }) : <MenuComponent menuData={menuData} />}
          </Navbar>
        </div>
      ) : null}

      {children}
      {themeConfig.layout.customizer === true ? (
        <Customizer
          skin={skin}
          isRtl={isRtl}
          layout={layout}
          setSkin={setSkin}
          setIsRtl={setIsRtl}
          isHidden={isHidden}
          setLayout={setLayout}
          footerType={footerType}
          navbarType={navbarType}
          transition={transition}
          setIsHidden={setIsHidden}
          themeConfig={themeConfig}
          navbarColor={navbarColor}
          contentWidth={contentWidth}
          setTransition={setTransition}
          setFooterType={setFooterType}
          setNavbarType={setNavbarType}
          setLastLayout={setLastLayout}
          setNavbarColor={setNavbarColor}
          setContentWidth={setContentWidth}
        />
      ) : null}

      {
        userPermission?.appName && <>
          <div style={{position: "fixed", bottom: '5%', zIndex: '99', right: '30px'}}>
            <a className='btn btn-outline-danger shadow-md text-danger' style={{background: 'white'}} onClick={() => setBug(!bug)}>
              Report a Bug
            </a>
          </div>
        </>
      }
      {themeConfig.layout.scrollTop === true ? (
        <div className='scroll-to-top'>
          <ScrollToTop showOffset={300} className='scroll-top d-block'>
            <Button className='btn-icon' color='primary'>
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}

      <Modal
        isOpen={bug}
        toggle={() => setBug(!bug)}
        className='modal-dialog-centered'
        >
        <ModalHeader className='p-2 pt-1 pb-0 custom_header' toggle={() => setBug(!bug)}>
          <h5 className='m-0'>Help Us Build a Better Experience</h5>
          <span style={{fontWeight: '400', fontSize: '12px'}}>Report a bug or leave your feedback and we'll get working on it!</span>
        </ModalHeader>
        <ModalBody>
          <CreateSupportTicket isQuick={true} setBug={setBug} data={{priority: "High", issue: 21, subIssue: 27}} />
        </ModalBody>
      </Modal>

    </div>
  )
}
export default HorizontalLayout
