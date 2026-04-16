import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { database } from '../../api/database';

const Footer = () => {
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  useEffect(() => {
    database.getCategories().then(data => setCategories(data.slice(0, 5))).catch(console.error);
  }, []);

  return (
    <footer className="bg-clara-black text-white pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-20">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif tracking-tighter">DONDE CLARA</h2>
          <p className="text-sm text-white/50 leading-relaxed font-light">
            Elevando el estilo cotidiano desde la histórica **Cartagena, Colombia**. Piezas seleccionadas que combinan lujo, comodidad y elegancia atemporal.
          </p>
          <div className="flex flex-col gap-4 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-clara-pink-400" />
              <span>Cartagena, Colombia</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Colecciones</h3>
          <ul className="space-y-4 text-sm text-white/50">
            {categories.map(cat => (
              <li key={cat.name}><a href={`/catalogo?category=${encodeURIComponent(cat.name)}`} className="hover:text-white transition-colors">{cat.name}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Ubicación</h3>
          <p className="text-sm text-white/50 leading-relaxed font-light">
            Cartagena De Indias
          </p>

        </div>
      </div>

      <div className="container mx-auto px-6 mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">
          © {new Date().getFullYear()} Donde Clara — Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-8">
          <a href="#" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">Términos</a>
          <a href="#" className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors">Privacidad</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
