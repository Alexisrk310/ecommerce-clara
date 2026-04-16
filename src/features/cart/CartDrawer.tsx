import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { formatPrice } from '../../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cartItems, removeFromCart, updateQuantity, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-clara-black/40 backdrop-blur-sm z-70"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-80 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-clara-pink-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-clara-pink-500" />
                <h2 className="text-xl font-serif">Tu Carrito ({itemCount})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-clara-gray rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="grow overflow-y-auto p-6 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-clara-gray shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium pr-8">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-clara-black/30 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-clara-black/60 mt-1">
                        {formatPrice(item.price)} {item.size && <span className="ml-2 px-2 py-0.5 bg-clara-pink-50 text-clara-pink-500 text-[10px] rounded uppercase font-bold">Talla: {item.size}</span>}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center border border-clara-pink-100 rounded-none">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-clara-pink-50 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-clara-pink-50 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-24">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif text-lg italic">Tu carrito está vacío</p>
                  <button onClick={onClose} className="text-xs uppercase tracking-widest underline underline-offset-4 decoration-clara-pink-300">
                    Empezar a comprar
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-clara-pink-100 bg-clara-gray/30 space-y-4">
                <div className="flex justify-between items-center text-clara-black/60 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-serif text-xl">Total</span>
                  <span className="font-serif text-xl font-bold text-clara-pink-500">{formatPrice(total)}</span>
                </div>
                <Link 
                  to="/pago"
                  onClick={onClose}
                  className="w-full bg-clara-black text-white py-4 text-xs uppercase tracking-widest font-bold hover:bg-clara-pink-500 transition-luxury flex items-center justify-center gap-2"
                >
                  Finalizar Compra <ChevronRight size={14} />
                </Link>
                <button 
                  onClick={onClose}
                  className="w-full text-center text-[10px] uppercase tracking-widest text-clara-black/40 hover:text-clara-black transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
