import { supabase } from './supabase';
export { supabase };

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: string;
  stock: number;
  active?: boolean;
  featured?: boolean;
  sizes?: string[];
  created_at?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const database = {
  supabase,
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []) as Category[];
  },

  // Products
  async getProducts(options?: { categorySlug?: string; featured?: boolean }) {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)');

    if (options?.featured) {
      query = query.eq('featured', true);
    }

    if (options?.categorySlug && options.categorySlug !== 'Todos') {
      // First get category ID from slug
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', options.categorySlug)
        .single();
      
      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Product[];
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  // Admin Methods
  async upsertProduct(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .upsert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async createCategory(name: string, slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug })
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async updateCategory(id: string, name: string, slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Stats
  async getDashboardStats() {
    const [products, categories] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true })
    ]);

    return {
      productsCount: products.count || 0,
      categoriesCount: categories.count || 0,
      totalSales: 0, // Mock for now until orders table is implemented
      ordersCount: 0 // Mock for now until orders table is implemented
    };
  }
};
