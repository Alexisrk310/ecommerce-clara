import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, Heart, Share2, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { formatPrice } from '../utils/format';
import { toast } from 'react-hot-toast';
import { database } from '../api/database';
import type { Product } from '../api/database';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await database.getProductById(id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('No pudimos encontrar el producto solicitado');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }
    
    // Adapt product to CartItem format
    const cartProduct = {
      ...product,
      size: selectedSize,
      category: (typeof product.category === 'object' && product.category !== null) 
        ? (product.category as any).name 
        : (product as any).category || 'Sin Categoría'
    };

    addToCart(cartProduct);
    toast.success('Añadido al carrito con éxito', {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        borderRadius: '0',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-clara-pink-500" />
        <p className="text-xs uppercase tracking-[0.2em] text-clara-black/40">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <p className="text-xl font-serif italic text-clara-black/40">Lo sentimos, este producto ya no está disponible.</p>
        <Link to="/catalogo" className="bg-clara-black text-white px-8 py-3 text-[10px] uppercase tracking-widest">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-clara-black/40 hover:text-clara-pink-500 transition-colors mb-12">
          <ChevronLeft size={14} />
          Volver a la Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[3/4] bg-clara-gray overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-xs uppercase tracking-[0.4em] text-clara-pink-500 font-bold mb-4">
              {(typeof product.category === 'object' && product.category !== null) 
                ? (product.category as any).name 
                : (product as any).category || 'Sin Categoría'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter text-clara-black mb-6">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-clara-black/80 mb-8">
              {formatPrice(product.price)}
            </p>
            
            <div className="space-y-8 mb-12">
              <p className="text-sm leading-relaxed text-clara-black/60 font-light whitespace-pre-line">
                {product.description}
              </p>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest font-bold">Estado</h3>
                <div className="flex items-center gap-2 text-sm text-clara-black/60">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                  {product.stock > 0 ? `Disponible (${product.stock} unidades)` : 'Agotado'}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold">Seleccionar Talla</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 text-[10px] uppercase tracking-widest font-bold border transition-luxury ${
                          selectedSize === size
                            ? 'border-clara-black bg-clara-black text-white'
                            : 'border-clara-black/10 text-clara-black/60 hover:border-clara-black/30 hover:text-clara-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-5 px-8 text-xs uppercase tracking-[0.2em] font-bold transition-luxury flex items-center justify-center gap-3 ${
                  product.stock > 0 
                  ? 'bg-clara-black text-white hover:bg-clara-pink-500' 
                  : 'bg-clara-gray text-clara-black/30 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} />
                {product.stock > 0 ? 'Comprar Ahora' : 'Agotado'}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 border border-clara-black/10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest hover:border-clara-pink-300 transition-colors">
                  <Heart size={14} /> Wishlist
                </button>
                <button className="py-4 border border-clara-black/10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest hover:border-clara-pink-300 transition-colors">
                  <Share2 size={14} /> Compartir
                </button>
              </div>
            </div>

            {/* Value Props */}
            <div className="mt-12 pt-12 border-t border-clara-gray flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-clara-gray flex items-center justify-center">
                  <Truck size={18} className="text-clara-black/60" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Envío Nacional</h4>
                  <p className="text-[10px] text-clara-black/40">Gratis en Cartagena</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-clara-gray flex items-center justify-center">
                  <ShieldCheck size={18} className="text-clara-black/60" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Pago Seguro</h4>
                  <p className="text-[10px] text-clara-black/40">Pedido directo a WhatsApp</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
