import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, LogOut, ChevronLeft, Store } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      setIsConfirmingLogout(false);
      navigate('/acceso');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Productos', icon: Package, href: '/admin/productos' },
    { name: 'Categorías', icon: Tag, href: '/admin/categorias' },
  ];

  return (
    <div className="flex min-h-screen bg-clara-gray">
      {/* Sidebar */}
      <aside className="w-64 bg-clara-black text-white hidden md:flex flex-col">
        <div className="p-8">
          <Link to="/" className="text-xl font-serif text-white tracking-tighter flex items-center gap-2">
            <ChevronLeft size={16} />
            Donde Clara
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-clara-pink-400 mt-2">Panel de Control</p>
        </div>

        <nav className="grow px-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-luxury',
                  isActive
                    ? 'bg-clara-pink-500 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white w-full transition-colors group"
          >
            <Store size={18} className="group-hover:-translate-x-1 transition-transform" />
            Ir a la Tienda
          </Link>
          <button 
            onClick={() => setIsConfirmingLogout(true)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white w-full transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grow flex flex-col">
        <header className="h-16 bg-white border-b border-clara-pink-100 flex items-center justify-between px-8">
          <h1 className="text-lg font-serif">Administración</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-clara-pink-100 flex items-center justify-center text-clara-pink-500 font-bold text-xs">
              AD
            </div>
          </div>
        </header>
        <div className="p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingLogout && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmingLogout(false)}
              className="absolute inset-0 bg-clara-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white p-8 w-full max-w-sm shadow-premium text-center border-t-4 border-clara-pink-500"
            >
              <div className="mx-auto w-12 h-12 bg-clara-pink-50 text-clara-pink-500 rounded-full flex items-center justify-center mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-serif mb-2">¿Cerrar sesión?</h3>
              <p className="text-sm text-clara-black/60 mb-8">
                Tendrás que volver a ingresar tus credenciales para acceder al panel.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsConfirmingLogout(false)}
                  className="flex-1 py-3 border border-clara-black/10 text-[10px] uppercase tracking-widest font-bold hover:bg-clara-gray transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSignOut}
                  className="flex-1 py-3 bg-clara-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-clara-pink-500 transition-luxury"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
