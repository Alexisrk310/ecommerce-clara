import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCart } from '../../features/cart/CartContext';
import CartDrawer from '../../features/cart/CartDrawer';
import { Link } from 'react-router-dom';
import { database } from '../../api/database';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState<{name: string}[]>([]);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    database.getCategories().then(data => setCategories(data.slice(0, 4))).catch(console.error);
  }, []);

  const navLinks = [
    { name: 'Catálogo', href: '/catalogo' },
    ...categories.map(c => ({ name: c.name, href: `/catalogo?category=${encodeURIComponent(c.name)}` }))
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-luxury py-4 px-6 md:px-12 flex items-center justify-between',
          isScrolled ? 'bg-white/95 backdrop-blur-md py-3' : 'bg-transparent'
        )}
      >
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-clara-black"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link to="/" className="text-2xl md:text-3xl font-serif tracking-tighter text-clara-black">
            Donde Clara
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 mx-auto">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="text-sm uppercase tracking-widest text-clara-black/70 hover:text-clara-pink-500 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden sm:block p-2 text-clara-black hover:text-clara-pink-500 transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-clara-black hover:text-clara-pink-500 transition-colors">
            <User size={20} />
          </button>
          <button 
            className="p-2 text-clara-black relative hover:text-clara-pink-500 transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 bg-clara-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl">Donde Clara</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-2xl font-serif text-clara-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 border-t border-clara-pink-100 italic text-clara-pink-400">
              Moda Premium & Estilo
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
