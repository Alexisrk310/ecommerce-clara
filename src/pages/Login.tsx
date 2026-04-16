import { useState } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Loader2, ChevronLeft, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('¡Bienvenida de nuevo, Clara!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-clara-gray flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-clara-pink-100/30 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-clara-pink-100/20 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-clara-black/40 hover:text-clara-black transition-luxury mb-8 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a la tienda
        </Link>

        <div className="bg-white p-10 shadow-premium border border-clara-pink-50 relative">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-clara-black text-white rounded-full flex items-center justify-center">
              <Shield size={32} strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif mb-2">Donde Clara</h1>
            <p className="text-sm text-clara-black/40 uppercase tracking-widest">Panel de Administración</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Correo Electrónico</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                placeholder="clara@dondeclara.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Contraseña</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-clara-black text-white py-5 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-clara-pink-500 transition-luxury flex items-center justify-center gap-3 shadow-lg shadow-black/5"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Iniciar Sesión <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-[10px] text-clara-black/30 uppercase tracking-[0.2em] leading-loose">
            Acceso restringido únicamente para personal autorizado <br />
            de Donde Clara Cartagena.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
