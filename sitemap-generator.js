// import pkg from 'react-router-sitemap';
const Sitemap = require('react-router-sitemap').default;

const router = [
    {
        path: '/',
    },
    {
        path: '/products/superleadz/',
    },
    {
        path: '/products/superleadz/features/',
    },
    {
        path: '/products/superleadz/pricing/',
    },
    {
        path: '/products/superleadz/faq',
    },
    {
        path: '/products/superleadz/build-email-lists-verified-leads',
    },
    {
        path: "/products/superleadz/one-click-offer-redemption/",
    },
    {
        path: "/products/superleadz/dual-verification-qualified-lead-generation/",
    },
    {
        path: '/products/flash-accounts/',
    },
    {
        path: '/products/flash-accounts/features/',
    },
    {
        path: '/products/flash-accounts/pricing/',
    },
    {
        path: '/products/flash-accounts/faq/',
    },
    {
        path: '/products/infiniti/',
    },
    {
        path: '/products/sniper/',
    },
    {
        path: '/products/semperfi/',
    },
    {
        path: '/merchant/signup',
    },
    {
        path: '/merchant/login',
    },
    {
        path: '/partners',
    },
    {
        path: '/partners/faq',
    },
    {
        path: '/blog',
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
    {
        path: '/contact-us',
    },
    {
        path: '/contact-us/:type',
    },
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
    {
        path: '/terms-of-use/',
    },
    {
        path: '/privacy-policy/',
    }
];

(
    new Sitemap(router)
        .build('https://xircls.com/')
        .save('./sitemap.xml')
)