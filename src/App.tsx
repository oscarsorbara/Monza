import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Account from '@/pages/Account';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Contact from '@/pages/Contact'; // Replaces Maintenance
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BookingSuccess from '@/pages/BookingSuccess';

import SmoothScroll from '@/components/layout/SmoothScroll';
import PageTransition from '@/components/layout/PageTransition';

import { CartNotification } from '@/components/cart/CartNotification';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <CartNotification />
      <FloatingWhatsApp />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />



        {/* Public Routes with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
          <Route path="/catalog" element={<PageTransition><Catalog /></PageTransition>} />
          <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/maintenance" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        </Route>

        {/* Checkout Routes (No Navbar usually, but keeping for continuity or different layout) */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<OrderConfirmation />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <SmoothScroll>
        {/* Global Fixed Background */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 80%), 
              radial-gradient(circle at 50% 100%, rgba(220, 38, 38, 0.1) 0%, transparent 60%)
            `
          }}
        />

        <div className="min-h-screen relative z-10 text-white flex flex-col font-sans selection:bg-monza-red selection:text-white">
          <AnimatedRoutes />
        </div>
      </SmoothScroll>
    </Router>
  );
}

export default App;
