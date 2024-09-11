import React from 'react';
import About from '../pages/about';
import Contact from '../pages/contact';
import GetStarted from '../pages/getStarted';
import LandingPage from '../pages/home';
import PrivacyPolicy from '../pages/privacyPolicy';
import ProductPanel from '../pages/product';
import ProductDetail from '../pages/productDetail';
import RefundPolicy from '../pages/refundPolicy';
import ResetPassword from '../pages/resetPassword';
import ShippingPolicy from '../pages/shippingPolicy';
import TermsCondition from '../pages/termsCondition';
import Checkout from '../pages/checkout';
 
const publicRoutes = [
  {
    id: crypto.randomUUID(),
    title: 'Home',
    route: '/',
    isActiveRoute: true,
    element: <LandingPage />
  },
  {
    id: crypto.randomUUID(),
    title: 'Product',
    route: '/product',
    isActiveRoute: true,
    element: <ProductPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Product',
    route: '/product/:id',
    isActiveRoute: false,
    element: <ProductDetail />
  },
  {
    id: crypto.randomUUID(),
    title: 'About Us',
    route: '/about',
    isActiveRoute: true,
    element: <About />
  },
  {
    id: crypto.randomUUID(),
    title: 'Contact',
    route: '/contact',
    isActiveRoute: true,
    element: <Contact />
  },
  {
    id: crypto.randomUUID(),
    title: 'Refund Policy',
    route: '/refund-policy',
    isActiveRoute: true,
    element: <RefundPolicy />
  },
  {
    id: crypto.randomUUID(),
    title: 'Shipping Policy',
    route: '/shipping-policy',
    isActiveRoute: true,
    element: <ShippingPolicy />
  },
  {
    id: crypto.randomUUID(),
    title: 'Privacy Policy',
    route: '/privacy-policy',
    isActiveRoute: false,
    element: <PrivacyPolicy />
  },
  {
    id: crypto.randomUUID(),
    title: 'Terms & Conditions',
    route: '/terms-and-conditions',
    isActiveRoute: false,
    element: <TermsCondition />
  },
  {
    id: crypto.randomUUID(),
    title: 'Get Started',
    route: '/get-started',
    isActiveRoute: false,
    element: <GetStarted />
  },
  {
    id: crypto.randomUUID(),
    title: 'Reset Password',
    route: '/reset-password',
    isActiveRoute: false,
    element: <ResetPassword />
  },
  {
    id: crypto.randomUUID(),
    title: 'Checkout',
    route: '/checkout',
    isActiveRoute: false,
    element: <Checkout />
  },
]

const ContentRoute = () => {
  let defaultRoutes = publicRoutes 

  return {
    defaultRoutes
  };
}

export default ContentRoute

