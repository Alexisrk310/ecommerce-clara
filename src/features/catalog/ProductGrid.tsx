import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { Search } from 'lucide-react';
import { database } from '../../api/database';
import type { Product } from '../../api/database';

const ProductGrid = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

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
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, debouncedSearchQuery, products]);

  // Removed full-screen loader layout
  return (
    <div className="flex flex-col gap-10 md:gap-14 px-4 md:px-0">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 text-[10px] uppercase tracking-[0.2em] transition-luxury border whitespace-nowrap font-medium ${
                activeCategory === cat
                  ? 'bg-clara-black text-white border-clara-black shadow-premium'
                  : 'bg-white text-clara-black/70 border-clara-black/20 hover:border-clara-black/50 hover:text-clara-black hover:bg-clara-gray'
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
      {loading || isSearching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex flex-col animate-pulse">
              <div className="aspect-3/4 bg-clara-gray w-full mb-4"></div>
              <div className="h-3 bg-clara-gray w-1/3 mb-2"></div>
              <div className="h-4 bg-clara-gray w-3/4 mb-1"></div>
              <div className="h-4 bg-clara-gray w-1/4"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
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
