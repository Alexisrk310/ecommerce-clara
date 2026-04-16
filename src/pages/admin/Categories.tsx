import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Tag, Loader2 } from 'lucide-react';
import { database } from '../../api/database';
import type { Category } from '../../api/database';
import { toast } from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await database.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      if (editingCategory) {
        await database.updateCategory(editingCategory.id, newCategoryName.trim(), slug);
        toast.success('Categoría actualizada');
      } else {
        await database.createCategory(newCategoryName.trim(), slug);
        toast.success('Categoría creada');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setNewCategoryName('');
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.message || 'Error al guardar categoría');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados podrían quedar sin categoría.')) {
      try {
        await database.deleteCategory(id);
        toast.success('Categoría eliminada');
        fetchCategories();
      } catch (error: any) {
        toast.error(error?.message || 'Error al eliminar categoría');
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif tracking-tighter">Categorías</h2>
          <p className="text-sm text-clara-black/40 mt-1">Gestiona las agrupaciones de productos de tu tienda.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setNewCategoryName(''); setIsModalOpen(true); }}
          className="bg-clara-black text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-clara-pink-500 transition-luxury flex items-center gap-2"
        >
          <Plus size={16} /> Nueva Categoría
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow-premium border-b-2 border-clara-pink-200">
          <p className="text-[10px] uppercase tracking-widest text-clara-black/40 font-bold mb-1">Total Categorías</p>
          <p className="text-2xl font-serif">{loading ? '...' : categories.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-premium overflow-hidden min-h-[300px]">
        <div className="p-6 border-b border-clara-gray flex items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-clara-black/20" size={16} />
            <input 
              type="text" 
              placeholder="Buscar categorías..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-clara-gray border-none text-sm outline-none focus:ring-1 focus:ring-clara-pink-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-clara-pink-500" />
            <p className="text-xs uppercase tracking-widest text-clara-black/30">Cargando categorías...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-clara-gray/50 border-b border-clara-gray">
                  <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Categoría</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Slug</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clara-gray">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-clara-gray/20 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-clara-pink-50 flex items-center justify-center">
                          <Tag size={14} className="text-clara-pink-600" />
                        </div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-mono text-clara-black/40">/{category.slug}</td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingCategory(category); setNewCategoryName(category.name); setIsModalOpen(true); }}
                          className="p-2 hover:bg-white rounded transition-colors text-clara-black/40 hover:text-clara-pink-500"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 hover:bg-white rounded transition-colors text-clara-black/40 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Simple Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-clara-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-serif mb-6">{editingCategory ? 'Editar' : 'Nueva'} Categoría</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-clara-black/40">Nombre</label>
                  <input 
                    required
                    autoFocus
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                    placeholder="Ej. Ropa de Verano"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-clara-black/10 text-[10px] uppercase tracking-widest font-bold hover:bg-clara-gray transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-clara-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-clara-pink-500 transition-luxury"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
