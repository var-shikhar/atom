import React from 'react';
import { useAuthContext } from '../context/authContext';
import CustomerPanel from '../pages/admin/customerPanel';
import OrderPanel from '../pages/admin/orderPanel';
import ProductPanel from '../pages/admin/productPanel';
import SettingPanel from '../pages/admin/settingPanel';
import CouponPanel from '../pages/admin/couponPanel';
import CustomerDetail from '../pages/admin/customerDetail';

const adminRoutes = [
  {
    id: crypto.randomUUID(),
    title: 'Product List',
    route: 'products',
    isActiveRoute: true,
    element: <ProductPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Order List',
    route: 'orders',
    isActiveRoute: true,
    element: <OrderPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Customer List',
    route: 'customers',
    isActiveRoute: true,
    element: <CustomerPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Customer List',
    route: 'customers/:id',
    isActiveRoute: false,
    element: <CustomerDetail />
  },
  {
    id: crypto.randomUUID(),
    title: 'Coupons',
    route: 'coupons',
    isActiveRoute: true,
    element: <CouponPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Settings',
    route: 'settings',
    isActiveRoute: true,
    element: <SettingPanel />
  },
]

const ContentRoute = () => {
  const { userData } = useAuthContext();
  let defaultRoutes = adminRoutes;
  return {
    defaultRoutes
  };
}

export default ContentRoute

