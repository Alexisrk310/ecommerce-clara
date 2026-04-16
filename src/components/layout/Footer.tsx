import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
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
            <li><a href="#" className="hover:text-white transition-colors">Nueva Colección</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bestsellers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Accesorios Premium</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Edición Especial</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.3em] font-bold">Ubicación</h3>
          <div className="w-full h-48 bg-clara-gray overflow-hidden grayscale contrast-125 opacity-70 hover:opacity-100 transition-opacity duration-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.181816706788!2d-75.5505822!3d10.4229062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef6259960ca330f%3A0x62804f3db6e6900d!2sCentro%20Hist%C3%B3rico%2C%20Cartagena%20de%20Indias%2C%20Bol%C3%ADvar!5e0!3m2!1ses!2sco!4v1713050000000!5m2!1ses!2sco" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Donde Clara Cartagena"
            />
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-2 flex items-center gap-2">
            <MapPin size={10} />
            Visítanos en el Centro Histórico
          </p>
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
