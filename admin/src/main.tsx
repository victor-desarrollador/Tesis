import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Invoices from './pages/Invoices.tsx'
import Products from './pages/Products.tsx'
import Orders from './pages/Orders.tsx'
import Accounts from './pages/Accounts.tsx'
import Users from './pages/Users.tsx'
import Banners from './pages/Banners.tsx'
import Categories from './pages/Categories.tsx'
import Brands from './pages/Brands.tsx'


const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  { path: '/', element: <App />, children:[
    {
    index: true,
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path:"/dashboard/Accounts", 
    element: <Accounts />
  },
  {
    path:"/dashboard/Users", 
    element: <Users />
  },
  {
    path:"/dashboard/Orders", 
    element: <Orders />
  },
  {
    path:"/dashboard/Invoices", 
    element: <Invoices />
  },
  {
    path:"/dashboard/Products", 
    element: <Products /> 
  },
  {
    path:"/dashboard/Banners", 
    element: <Banners /> 
  },
  {
    path:"/dashboard/Categories", 
    element: <Categories /> 
  },
  {
    path:"/dashboard/Brands", 
    element: <Brands /> 
  }
  ] }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
