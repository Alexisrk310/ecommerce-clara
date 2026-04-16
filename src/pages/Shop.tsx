import { useState } from 'react';
import ProductGrid from '../features/catalog/ProductGrid';
import { motion } from 'framer-motion';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const categories = ['Todos', 'Ropa', 'Accesorios', 'Fragancias', 'Edición Especial'];

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tighter">Catálogo</h1>
            <p className="text-clara-black/50 max-w-md text-sm leading-relaxed">
              Descubre nuestra selección curada de piezas exclusivas, diseñadas para elevar tu estilo personal con la esencia de Cartagena.
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-[10px] uppercase tracking-[0.3em] font-bold px-6 py-2 transition-luxury border rounded-full ${
                  activeCategory === category
                    ? 'bg-clara-black text-white border-clara-black'
                    : 'bg-transparent text-clara-black/40 border-clara-black/10 hover:border-clara-black/30 hover:text-clara-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <ProductGrid />
      </div>
    </div>
  );
};

export default Shop;
