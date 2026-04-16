import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/format';
import { database } from '../api/database';
import type { Product } from '../api/database';
import ProductGrid from '../features/catalog/ProductGrid';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const products = await database.getProducts({ featured: true });
        if (products.length > 0) {
          setFeaturedProduct(products[0]);
        }
      } catch (error) {
        console.error('Error fetching featured product:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-clara-pink-50 -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-clara-pink-100/30 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-clara-pink-500 font-medium tracking-[0.2em] uppercase text-sm mb-4">
              ESENCIA, BELLEZA & ESTILO
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-clara-black leading-[1.1] mb-8">
              Realza tu magia <br />
              <span className="italic text-clara-pink-400">en cada detalle</span>
            </h1>
            <p className="text-lg text-clara-black/60 max-w-md mb-10 leading-relaxed">
              Descubre nuestra fascinante colección: moda exclusiva, maquillajes radiantes, deliciosas colonias, splash y cuidado de la piel. Encuentra todo lo que necesitas para deslumbrar y mimarte todos los días.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalogo" className="bg-clara-black text-white px-8 py-4 rounded-none uppercase tracking-widest text-sm hover:bg-clara-pink-500 transition-luxury flex items-center gap-3">
                Explorar Catálogo
                <ArrowRight size={18} />
              </Link>
              <Link to="/catalogo" className="border border-clara-black text-clara-black px-8 py-4 rounded-none uppercase tracking-widest text-sm hover:bg-clara-black hover:text-white transition-luxury">
                Ver Categorías
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-3/4 max-w-md mx-auto"
          >
            {loadingFeatured ? (
              <div className="w-full h-full bg-clara-gray animate-pulse shadow-premium" />
            ) : featuredProduct ? (
              <>
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover shadow-premium relative z-10"
                />
                
                {/* Floating Element */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -right-8 glass p-6 shadow-premium hidden md:block z-20"
                >
                  <p className="text-xs uppercase tracking-widest text-clara-pink-500 mb-1">Novedad</p>
                  <p className="text-lg font-serif">{featuredProduct.name}</p>
                  <p className="text-sm font-medium">{formatPrice(featuredProduct.price)}</p>
                  <Link to={`/producto/${featuredProduct.id}`} className="text-[10px] uppercase underline mt-2 inline-block">Ver detalle</Link>
                </motion.div>
              </>
            ) : (
              <div className="w-full h-full bg-clara-gray flex items-center justify-center font-serif text-clara-black/40 italic shadow-premium">
                Nuevas piezas pronto...
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-24 bg-white border-t border-clara-pink-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Nuestra Selección</h2>
            <p className="text-clara-black/40 italic">Piezas únicas seleccionadas en Cartagena</p>
          </div>
          
          <ProductGrid />
        </div>
      </section>
    </div>
  );
};

export default Home;
