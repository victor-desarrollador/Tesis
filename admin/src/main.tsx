import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import ResetPassword from './pages/ResetPassword.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Invoices from './pages/Invoices.tsx'
import Products from './pages/Products.tsx'
import Orders from './pages/Orders.tsx'
import Account from './pages/Account.tsx'
import Users from './pages/Users.tsx'
import Banners from './pages/Banners.tsx'
import Categories from './pages/Categories.tsx'
import Brands from './pages/Brands.tsx'
import AccessDenied from './pages/AccessDenied.tsx'


const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/acceso-denegado', element: <AccessDenied /> },

  {
    path: '/', element: <App />, children: [
      {
        index: true,
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: "/dashboard/account",
        element: <Account />
      },
      {
        path: "/dashboard/users",
        element: <Users />
      },
      {
        path: "/dashboard/orders",
        element: <Orders />
      },
      {
        path: "/dashboard/invoices",
        element: <Invoices />
      },
      {
        path: "/dashboard/products",
        element: <Products />
      },
      {
        path: "/dashboard/banners",
        element: <Banners />
      },
      {
        path: "/dashboard/categories",
        element: <Categories />
      },
      {
        path: "/dashboard/brands",
        element: <Brands />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
