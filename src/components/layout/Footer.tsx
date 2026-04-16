import { useState, useEffect } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { database } from '../../api/database';

const Footer = () => {
  const [categories, setCategories] = useState<{name: string}[]>([]);

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
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-clara-pink-400" />
              <span>contacto@dondeclara.com</span>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-clara-pink-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="hover:text-clara-pink-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-clara-pink-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
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
          <div className="flex flex-col gap-2 mt-4 text-sm text-white/50">
            <p className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={10} />
              Centro Histórico
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10 flex flex-col md:row justify-between items-center gap-6">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">
          © 2026 Donde Clara — Todos los derechos reservados.
        </p>
        <div className="flex gap-8 text-[10px] text-white/30 uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
