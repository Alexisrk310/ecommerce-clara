import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../api/database';
import type { Product } from '../api/database';
import ProductCard from '../components/ui/ProductCard';
import { ChevronLeft, Heart } from 'lucide-react';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        setLoading(true);
        const favIds = JSON.parse(localStorage.getItem('clara_favorites') || '[]');
        
        if (favIds.length === 0) {
          setFavoriteProducts([]);
          setLoading(false);
          return;
        }

        const allProducts = await database.getProducts();
        const favs = allProducts.filter(p => favIds.includes(p.id));
        setFavoriteProducts(favs);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
    
    // Add event listener for local storage changes from same window
    const handleStorageChange = () => {
      fetchFavs();
    };
    
    window.addEventListener('favoritesUpdated', handleStorageChange);
    return () => window.removeEventListener('favoritesUpdated', handleStorageChange);
  }, []);

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/catalogo" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-clara-black/40 hover:text-clara-pink-500 transition-colors mb-6">
            <ChevronLeft size={14} />
            Continuar Comprando
          </Link>
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-clara-pink-500" />
            <h1 className="text-4xl font-serif text-clara-black">Tus Favoritos</h1>
          </div>
          <p className="text-sm mt-4 text-clara-black/60 italic">
            Las prendas y productos que más te han cautivado.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-clara-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-20 bg-clara-gray border border-clara-pink-50">
            <Heart size={48} className="mx-auto text-clara-black/20 mb-4" />
            <p className="text-lg font-serif italic text-clara-black/60 mb-6">Aún no tienes productos favoritos.</p>
            <Link 
              to="/catalogo" 
              className="inline-block bg-clara-black text-white px-8 py-4 uppercase tracking-widest text-xs hover:bg-clara-pink-500 transition-luxury"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
