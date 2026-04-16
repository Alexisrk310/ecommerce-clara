import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './features/cart/CartContext';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import PageTransition from './components/layout/PageTransition';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import Login from './pages/Login';

// Public Imports
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Success from './pages/Success';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clara-gray">
        <div className="w-8 h-8 border-2 border-clara-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/acceso" replace />;
  }
  
  return <>{children}</>;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <PageTransition><Home /></PageTransition>
            <Footer />
          </>
        } />
        <Route path="/catalogo" element={
          <>
            <Navbar />
            <PageTransition><Shop /></PageTransition>
            <Footer />
          </>
        } />
        <Route path="/producto/:id" element={
          <>
            <Navbar />
            <PageTransition><ProductDetails /></PageTransition>
            <Footer />
          </>
        } />
        <Route path="/pago" element={
          <>
            <Navbar />
            <PageTransition><Checkout /></PageTransition>
            <Footer />
          </>
        } />
        <Route path="/pedido-confirmado" element={
          <>
            <Navbar />
            <PageTransition><Success /></PageTransition>
            <Footer />
          </>
        } />
        
        {/* Auth Route */}
        <Route path="/acceso" element={<PageTransition><Login /></PageTransition>} />
        
        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout><PageTransition><Dashboard /></PageTransition></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/productos" element={
          <ProtectedRoute>
            <AdminLayout><PageTransition><AdminProducts /></PageTransition></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/categorias" element={
          <ProtectedRoute>
            <AdminLayout><PageTransition><AdminCategories /></PageTransition></AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <AnimatedRoutes />
            <Toaster position="bottom-right" />
            <FloatingWhatsApp />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
