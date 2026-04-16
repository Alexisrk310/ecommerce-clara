import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from '../../features/admin/ProductForm';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/format';
import { database } from '../../api/database';
import type { Product } from '../../api/database';

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await database.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (productData: any) => {
    try {
      await database.upsertProduct(productData);
      await fetchProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error?.message || 'Error al guardar el producto');
      throw error; // Re-throw so ProductForm knows it failed
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await database.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success('Producto eliminado');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const pCategory = p.category?.name || '';
    
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           pCategory.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif">Inventario de Productos</h2>
          <p className="text-sm text-clara-black/40">Gestiona tus productos, precios y existencias en tiempo real.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
          className="bg-clara-black text-white px-6 py-3 uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-clara-pink-500 transition-luxury"
        >
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-premium border border-clara-pink-50 overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-clara-pink-100 flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-clara-black/20" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              className="w-full pl-10 pr-4 py-2 bg-clara-gray border-none text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-clara-pink-500" />
            <p className="text-xs uppercase tracking-widest text-clara-black/30">Cargando inventario...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-clara-gray/50 text-[10px] uppercase tracking-widest text-clara-black/60">
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-clara-pink-50 hover:bg-clara-pink-50/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-clara-black/60">
                        {product.category?.name || 'Sin Categoría'}
                      </td>
                      <td className="px-6 py-4 font-bold">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-none text-[10px] font-bold ${
                          product.stock < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {product.stock} DISP.
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                          className="p-2 text-clara-black/40 hover:text-clara-black transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-clara-black/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="py-20 text-center text-clara-black/40 italic font-serif">
                No hay productos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ProductForm 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default AdminProducts;
