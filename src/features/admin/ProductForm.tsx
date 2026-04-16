import React, { useState, useEffect, useRef } from 'react';
import { X, Package, DollarSign, Tag, FileText, Loader2, Star, ImagePlus, Link, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../../api/database';
import type { Category, Product } from '../../api/database';
import { toast } from 'react-hot-toast';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: any) => Promise<void>;
  
}

type ImageMode = 'file' | 'url';

const ProductForm = ({ isOpen, onClose, product, onSave }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    stock: '',
    featured: false,
    image: '',
    sizes: '',
    
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState<ImageMode>('file');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          category_id: product.category_id,
          description: product.description,
          stock: product.stock.toString(),
          featured: product.featured,
          image: product.image,
          sizes: product.sizes ? product.sizes.join(', ') : '',
        });
        setImagePreview(product.image);
        setImageMode('url');
      } else {
        setFormData({
          name: '',
          price: '',
          category_id: '',
          description: '',
          stock: '',
          featured: false,
          image: '',
          sizes: '',
        });
        setImagePreview('');
        setImageFile(null);
        setImageMode('file');
      }

      const fetchCategories = async () => {
        try {
          setLoading(true);
          const cats = await database.getCategories();
          setCategories(cats);
          if (!product && cats.length > 0) {
            setFormData(prev => ({ ...prev, category_id: cats[0].id }));
          }
        } catch (error) {
          toast.error('No pudimos cargar las categorías');
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }
  }, [isOpen, product]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar 5MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let finalImageUrl = formData.image;

      // Upload file if in file mode and a file was selected
      if (imageMode === 'file' && imageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await database.uploadImage(imageFile);
        } catch (uploadErr: any) {
          toast.error(`Error al subir imagen: ${uploadErr.message || 'Intenta con una URL'}`);
          setSubmitting(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      if (!finalImageUrl) {
        toast.error('Por favor agrega una imagen al producto');
        setSubmitting(false);
        return;
      }

      const sizesArray = formData.sizes 
        ? formData.sizes.split(',').map(s => s.trim().toUpperCase()).filter(s => s.length > 0)
        : [];

      await onSave({
        ...formData,
        id: product?.id,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: finalImageUrl,
        sizes: sizesArray.length > 0 ? sizesArray : [],
      });

      toast.success(product ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Error al guardar el producto');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-clara-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-clara-pink-100 flex justify-between items-center bg-clara-gray/50">
              <h2 className="text-xl font-serif">
                {product ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button disabled={submitting} onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-clara-pink-500" />
                <p className="text-xs uppercase tracking-widest text-clara-black/30">Cargando datos...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">

                {/* ── Image Section ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">
                      Imagen del Producto
                    </label>
                    {/* Toggle file / url */}
                    <div className="flex items-center gap-1 bg-clara-gray rounded p-1">
                      <button
                        type="button"
                        onClick={() => { setImageMode('file'); setFormData(p => ({ ...p, image: '' })); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded transition-all ${imageMode === 'file' ? 'bg-white shadow-sm text-clara-black' : 'text-clara-black/40 hover:text-clara-black/70'}`}
                      >
                        <Upload size={10} /> Archivo
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImageMode('url'); setImageFile(null); setImagePreview(formData.image); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded transition-all ${imageMode === 'url' ? 'bg-white shadow-sm text-clara-black' : 'text-clara-black/40 hover:text-clara-black/70'}`}
                      >
                        <Link size={10} /> URL
                      </button>
                    </div>
                  </div>

                  {imageMode === 'file' ? (
                    <div>
                      {/* Drop zone */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed transition-all cursor-pointer ${
                          dragOver
                            ? 'border-clara-pink-400 bg-clara-pink-50'
                            : imagePreview
                            ? 'border-clara-pink-200 bg-white'
                            : 'border-clara-gray hover:border-clara-pink-300 bg-clara-gray/40 hover:bg-clara-pink-50/30'
                        }`}
                      >
                        {imagePreview ? (
                          <div className="relative group">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-clara-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-xs font-bold uppercase tracking-widest">Cambiar imagen</p>
                            </div>
                          </div>
                        ) : (
                          <div className="py-10 flex flex-col items-center gap-3 text-clara-black/30">
                            <ImagePlus size={32} strokeWidth={1} />
                            <div className="text-center">
                              <p className="text-xs font-bold uppercase tracking-widest">Arrastra o haz clic para subir</p>
                              <p className="text-xs mt-1 text-clara-black/20">PNG, JPG, WEBP · Máx. 5 MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />
                      {imageFile && (
                        <p className="text-xs text-clara-black/40 mt-1.5 flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                          {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                      />
                      {imagePreview && (
                        <div className="aspect-video bg-clara-gray">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" onError={() => setImagePreview('')} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Name + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Nombre del Producto</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-clara-black/20" size={16} />
                      <input
                        required
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Categoría</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-clara-black/20" size={16} />
                      <select
                        required
                        className="w-full pl-10 pr-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm appearance-none"
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      >
                        <option value="">Seleccionar categoría...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Precio ($ COP)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-clara-black/20" size={16} />
                      <input
                        required
                        type="number"
                        min="0"
                        step="any"
                        className="w-full pl-10 pr-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Stock Inicial</label>
                    <input
                      required
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                {/* Tallas */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">
                    Tallas (opcional, separadas por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL"
                    className="w-full px-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm uppercase"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  />
                  <p className="text-[10px] text-clara-black/40">Ejemplo: S, M, L, XL. Principalmente usado para la categoría de Ropa.</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-clara-black/40">Descripción</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 text-clara-black/20" size={16} />
                    <textarea
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 bg-clara-gray border-none focus:ring-1 focus:ring-clara-pink-300 outline-none text-sm resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                      formData.featured ? 'text-clara-pink-500 bg-clara-pink-50' : 'text-clara-black/30 hover:text-clara-black/50'
                    }`}
                  >
                    <Star size={14} fill={formData.featured ? 'currentColor' : 'none'} />
                    Destacado en Portada
                  </button>
                </div>

                {/* Actions */}
                <div className="pt-6 flex gap-4">
                  <button
                    disabled={submitting}
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 border border-clara-black/10 uppercase tracking-widest text-[10px] font-bold hover:bg-clara-gray transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="flex-1 py-4 bg-clara-black text-white uppercase tracking-widest text-[10px] font-bold hover:bg-clara-pink-500 transition-luxury shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {uploadingImage ? 'Subiendo imagen...' : submitting ? 'Guardando...' : product ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductForm;
