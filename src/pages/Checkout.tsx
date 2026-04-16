import React from 'react';
import { useCart } from '../features/cart/CartContext';
import { formatPrice } from '../utils/format';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';

const Checkout = () => {
  const { cartItems, total } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const itemsList = cartItems.map(item => `- ${item.name}${item.size ? ` (Talla: ${item.size})` : ''} (${item.quantity}) x ${formatPrice(item.price)}`).join('%0A');
    const formattedTotal = formatPrice(total);
    const message = `¡Hola Donde Clara! 👋 Quiero realizar un pedido:%0A%0A*Productos:*%0A${itemsList}%0A%0A*Total:* ${formattedTotal}%0A%0A*Mis Datos:*%0A- Nombre: ${(e.target as any).nombre.value}%0A- Dirección: ${(e.target as any).direccion.value}%0A- Barrio: ${(e.target as any).barrio.value}%0A%0A¿Me podrían confirmar la disponibilidad y los pasos para el pago? ✨`;
    
    const whatsappUrl = `https://wa.me/573000000000?text=${message}`; // Replace with real number
    
    window.open(whatsappUrl, '_blank');
    navigate('/pedido-confirmado');
  };

  return (
    <div className="pt-32 pb-20 bg-clara-gray min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-serif tracking-tighter mb-12">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <form onSubmit={handlePlaceOrder} className="bg-white p-10 shadow-premium space-y-8">
              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold pb-4 border-b">Información de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input name="nombre" required placeholder="Nombre Completo" className="w-full bg-clara-gray border-none p-4 text-sm outline-none focus:ring-1 focus:ring-clara-pink-300" />
                  <input name="telefono" required placeholder="Teléfono" className="w-full bg-clara-gray border-none p-4 text-sm outline-none focus:ring-1 focus:ring-clara-pink-300" />
                </div>
                <input name="direccion" required placeholder="Dirección en Cartagena" className="w-full bg-clara-gray border-none p-4 text-sm outline-none focus:ring-1 focus:ring-clara-pink-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input name="barrio" required placeholder="Barrio / Edificio" className="w-full bg-clara-gray border-none p-4 text-sm outline-none focus:ring-1 focus:ring-clara-pink-300" />
                  <input name="notas" placeholder="Notas adicionales" className="w-full bg-clara-gray border-none p-4 text-sm outline-none focus:ring-1 focus:ring-clara-pink-300" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold pb-4 border-b">Método de Pago</h3>
                <div className="p-6 bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                  <div className="p-2 bg-emerald-500 text-white rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.18-2.18a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">Confirmación por WhatsApp</h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      Al confirmar, te redirigiremos a WhatsApp para finalizar el pago y coordinar el envío de forma personalizada.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white py-5 px-8 text-xs uppercase tracking-[0.2em] font-bold hover:bg-emerald-700 transition-luxury flex items-center justify-center gap-3 mt-8 shadow-lg shadow-emerald-900/10"
              >
                Confirmar y Pedir por WhatsApp <ChevronRight size={14} />
              </button>
            </form>
          </motion.div>

          {/* Cart Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <div className="bg-white p-8 shadow-premium space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold pb-4 border-b">Resumen del Pedido</h3>
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-clara-gray flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider">{item.name}</h4>
                      <p className="text-[10px] text-clara-black/40 mt-1">Cant: {item.quantity}{item.size ? ` · Talla: ${item.size}` : ''}</p>
                      <p className="text-xs font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t space-y-3">
                <div className="flex justify-between text-xs text-clara-black/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-clara-black/60">
                  <span>Envío (Cartagena)</span>
                  <span className="text-clara-pink-500 font-bold italic">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-serif pt-4">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] text-clara-black/40 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Pago Seguro 256-bit SSL
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
