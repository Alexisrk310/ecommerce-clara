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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} añadido al carrito`, {
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
      <div className="relative aspect-[3/4] overflow-hidden bg-clara-gray">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-clara-black text-white py-3 px-4 text-xs uppercase tracking-widest hover:bg-clara-pink-500 transition-luxury flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            Añadir al Carrito
          </button>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button className="p-2 bg-white rounded-full shadow-premium hover:text-clara-pink-500 transition-colors">
            <Heart size={18} />
          </button>
        </div>
      </div>

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
