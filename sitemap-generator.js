// import pkg from 'react-router-sitemap';
const Sitemap = require('react-router-sitemap').default;

const router = [
    {
        path: '/partners',
    },
    {
        path: '/partners/faq',
    },

    {
        path: '/products/superleadz/',
    },

    {
        // path: '/products/superleadz/lead-generation-nurturing-and-conversion/features',
        path: '/products/superleadz/features/',
    },
    {
        // path: '/products/superleadz/lead-generation-nurturing-and-conversion/pricing',
        path: '/products/superleadz/pricing/',
    },
    {
        // path: '/products/superleadz/lead-generation-nurturing-and-conversion/faqs',
        path: '/products/superleadz/faq',
    },
    {
        // path: '/products/sniper/',
        path: '/products/sniper/',
    },
    {
        path: '/products/infiniti/',
            // path: '/products/infiniti/',
    },
    {
        // path: '/products/semperfi/',
        path: '/products/semperfi/',
    },
    {
        path: '/products/flash-accounts/',
    },
    {
        path: '/products/flash-accounts/faq/',
    },
    {
        path: '/products/flash-accounts/pricing/',
    },
    {
        path: '/products/flash-accounts/features/',
    },
    {
        path: '/contact-us/:type',
    },
    {
        path: '/contact-us',
    },
    {
        path: '/about-us/why-XIRCLS',
    },
    {
        path: '/about-us/why-collaborative-marketing/',
    },
    {
        path: '/about-us/vision-&-mission-statement/',
    },

    // {
    // path: '/team',
    // },
    {
        path: '/blog',
    },
    // {
    // path: '/blog/:blogTitle',
    // },
    {
        path: '/blog/Conflict-Torture-or-Tool/',
    },
    {
        path: '/blog/Collaborative-Marketing-and-the-Future-of-ZeroParty-Data/',
    },
    {
        path: '/blog/Why-Companies-Need-to-Move-From-Diversity-To-Inclusion/',
    },
    {
        path: '/blog/Target-Audience-Are-Companies-At-War-With-Their-Customers/',
    },
    {
        path: '/blog/Current-Online-Marketing-Practices-Are-Making-You-Pay-More/',
    },
    {
        path: '/blog/Are-Bargain-Hunters-Killing-Your-Business/',
    },
    {
        path: '/blog/Mind-Games-Why-We-Buy-What-We-Buy/',
    },
    {
        path: '/blog/Are-Influencers-Worth-The-Price-Tag/',

    },
    {
        path: '/blog/The-Harsh-Truth-About-Customer-Loyalty-Programs/',
    },
    {
        path: '/blog/Playing-With-Power-The-Danger-Of-Monopolies/',
    },
    {
        path: '/blog/The-Devils-Currency-Our-Lives-For-Auction/',
    },
    // {
    // path: '/blog/author/:blogger',
    // },
    {
        path: '/blog/author/Darina_Litvina/',
    },
    {
        path: '/blog/author/Ian_White/',
    },
    {
        path: '/blog/author/Shakercha_Bradshaw/',
    },
    {
        path: '/blog/author/Adriana_Marcela_Torrenegra/',
    },
    {
        path: '/blog/author/Lauren_Deah/',
    },
    {
        path: '/blog/author/Kwanele_Ngobese/',
    },
    {
        path: '/blog/author/Allie_Hinds/',
    },
    {
        path: '/blog/author/Peyton-Sweeney/',
    },
    {
        path: '/blog/author/Dineo-Magakwa/',
    },
    {
        path: '/blog/author/Lauren_Deah/',
    },
    {
        path: '/blog/author/Allie_Hinds/',
    },
    // {
    // path: '/developers',
    // },
    {
        path: '/merchant/login',
    },
    {
        path: '/merchant/password_reset',
    },
    {
        path: '/merchant/signup',
    },
    {
        path: '/affiliate/login',
    },
    {
        path: '/affiliate/signup',
    },
    {
        path: '/terms-of-use/',
    },
    {
        path: '/privacy-policy/',
    },
    {
        path: '/merchant/home/',
    },
    {
        path: '/merchant/apps/',
    },
    // {
    //     path: '*',
    // },
    // {
    //     path: '/processing/',
    // },
    // {
    //     path: '/:flow/signup/',
    // },
    // {
    //     path: '/flow/login/',
    // },
    {
        path: '/merchant/verify-your-email/:slug/',
    },
    // {
    //     path: '/install_flow_failed/',
    // },
    // {
    //     path: '/codeskin/skin-type-test',
    // },
    {
        path: '/products/superleadz/build-email-lists-verified-leads',
    },
    {
        path: "/products/superleadz/one-click-offer-redemption/",
    },
    {
        path: "/products/superleadz/dual-verification-qualified-lead-generation/",
    }
];

(
    new Sitemap(router)
        .build('https://xircls.com/')
        .save('./sitemap.xml')
)