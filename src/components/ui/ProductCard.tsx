import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../features/cart/CartContext';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/format';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('clara_favorites') || '[]');
        setIsFavorite(favs.includes(product.id));
      } catch (e) {
        console.error(e);
      }
    };
    checkFavorite();
    window.addEventListener('favoritesUpdated', checkFavorite);
    return () => window.removeEventListener('favoritesUpdated', checkFavorite);
  }, [product.id]);

  const toggleFavorite = () => {
    try {
      const favs = JSON.parse(localStorage.getItem('clara_favorites') || '[]');
      let newFavs;
      if (isFavorite) {
        newFavs = favs.filter((favId: string) => favId !== product.id);
        toast.success('Eliminado de favoritos');
      } else {
        newFavs = [...favs, product.id];
        toast.success('Añadido a favoritos', { iconTheme: { primary: '#f06292', secondary: '#fff' } });
      }
      localStorage.setItem('clara_favorites', JSON.stringify(newFavs));
      setIsFavorite(!isFavorite);
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = (size?: string) => {
    addToCart({ ...product, size });
    toast.success(`${product.name} ${size ? `(Talla ${size}) ` : ''}añadido al carrito`, {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        borderRadius: '0',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
      iconTheme: {
        primary: '#f06292',
        secondary: '#fff',
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col"
    >
      {/* Image Container */}
      <Link to={`/producto/${product.id}`} className="relative aspect-3/4 block overflow-hidden bg-clara-gray">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute inset-x-0 bottom-0 p-2 md:p-4 translate-y-0 lg:translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20"
        >
          {product.sizes && product.sizes.length > 0 ? (
            <div className="w-full bg-clara-black text-white py-3 px-4 flex flex-wrap items-center justify-center gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(size); }}
                  className="w-8 h-8 flex items-center justify-center text-xs uppercase font-bold border border-white/20 hover:bg-clara-pink-500 hover:border-clara-pink-500 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(); }}
              className="w-full bg-clara-black text-white py-3 px-4 text-xs uppercase tracking-widest hover:bg-clara-pink-500 transition-luxury flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              Añadir al Carrito
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        >
          <button 
            onClick={toggleFavorite}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-premium hover:text-clara-pink-500 transition-colors"
          >
            <Heart size={18} className={isFavorite ? "fill-clara-pink-500 text-clara-pink-500" : ""} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <Link to={`/producto/${product.id}`} className="mt-4 flex flex-col group/info">
        <span className="text-[10px] uppercase tracking-[0.2em] text-clara-pink-500 mb-1">
          {product.category}
        </span>
        <h3 className="text-sm font-medium text-clara-black group-hover/info:text-clara-pink-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-clara-black/70 mt-1">{formatPrice(product.price)}</p>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
