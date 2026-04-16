import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../features/auth/AuthContext';
import { toast } from 'react-hot-toast';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
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

        <nav className="flex-grow px-4 space-y-2">
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

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white w-full transition-colors group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
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
    </div>
  );
};

export default AdminLayout;
