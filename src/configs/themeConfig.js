// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: 'XIRCLS',
    appLogoImage: require('@src/assets/images/logo/XIRCLS_LOGO.png').default,
    appNameLogo: require('@src/assets/images/logo/XIRCLS_text_logo.png').default
  },
  layout: {
    isRTL: false,
    skin: 'light', // light, dark, bordered, semi-dark
    routerTransition: 'fadeIn', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'vertical', // vertical, horizontal
    contentWidth: 'boxed', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'floating', // static , sticky , floating, hidden
      backgroundColor: 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'static' // static, sticky, hidden
    },
    customizer: true,
    scrollTop: false, // Enable scroll to top button
    toastPosition: 'top-center'
  }
}

export default themeConfig
