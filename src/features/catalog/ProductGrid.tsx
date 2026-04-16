import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { Search, Loader2 } from 'lucide-react';
import { database } from '../../api/database';
import type { Product } from '../../api/database';

const ProductGrid = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'Todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('Todos');
    }
  }, [categoryParam]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          database.getProducts(),
          database.getCategories()
        ]);
        
        setProducts(productsData);
        setCategories(['Todos', ...categoriesData.map(c => c.name)]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Ensure category is handled correctly (either string or object)
      const pCategory = (typeof p.category === 'object' && p.category !== null) 
        ? (p.category as any).name 
        : (p as any).category || '';
      
      const matchesCategory = activeCategory === 'Todos' || pCategory === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-clara-pink-500" />
        <p className="text-xs uppercase tracking-[0.2em] text-clara-black/40">Cargando selección...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-xs uppercase tracking-widest transition-luxury border rounded-full whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-clara-black text-white border-clara-black'
                  : 'bg-transparent text-clara-black/50 border-clara-pink-100 hover:border-clara-pink-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-clara-black/30" size={16} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 text-sm outline-none transition-luxury"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                category: (typeof product.category === 'object' && product.category !== null) 
                  ? (product.category as any).name 
                  : (product as any).category || 'Sin Categoría'
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-clara-black/40 italic font-serif text-xl">No encontramos lo que buscas en esta selección.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
