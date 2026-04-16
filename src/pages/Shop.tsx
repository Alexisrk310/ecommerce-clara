import { useState } from 'react';
import ProductGrid from '../features/catalog/ProductGrid';

const Shop = () => {

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
          
          {/* Filters se manejan en ProductGrid */}
        </div>

        {/* Grid */}
        <ProductGrid />
      </div>
    </div>
  );
};

export default Shop;
