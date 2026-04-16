import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-clara-pink-100 flex items-center justify-center text-clara-pink-500">
              <CheckCircle size={48} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter">¡Pedido Registrado!</h1>
            <p className="text-clara-black/60 font-light max-w-md mx-auto leading-relaxed">
              Hemos registrado tu interés. Deberías haber sido redirigido a WhatsApp para coordinar el pago. Si no fue así, usa el botón de abajo.
            </p>
          </div>

          <div className="bg-emerald-50 p-8 space-y-4 text-left border border-emerald-100">
            <div className="flex justify-between text-xs uppercase tracking-widest text-emerald-800/40">
              <span>Referencia #</span>
              <span className="text-emerald-900 font-bold">DC-W-82931</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-emerald-800/40">
              <span>Siguiente Paso</span>
              <span className="text-emerald-700 font-bold">Pago via WhatsApp</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-8">
            <a 
              href="https://wa.me/573000000000" // Use same number
              className="px-8 py-5 bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-700 transition-luxury flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10"
            >
              Hablar con un asesor ahora <ArrowRight size={14} />
            </a>
            <Link 
              to="/catalogo"
              className="px-8 py-4 border border-clara-black/10 text-clara-black text-[10px] uppercase tracking-widest font-bold hover:border-clara-pink-300 transition-colors flex items-center justify-center gap-2"
            >
              Volver al Catálogo <ShoppingBag size={14} />
            </Link>
          </div>
          
          <div className="pt-12">
            <p className="text-[10px] text-clara-black/30 uppercase tracking-[0.2em]">
              Donde Clara — Cartagena, Colombia
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;
