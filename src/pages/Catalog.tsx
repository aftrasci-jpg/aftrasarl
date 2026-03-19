import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Product, PRODUCT_CATEGORIES } from '../types';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductSlider } from '../components/ProductSlider';
import { useTranslation } from 'react-i18next';

export const Catalog = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    { id: 'all', label: t('catalog_page.category_list.all') },
    ...PRODUCT_CATEGORIES.map(cat => ({
      id: cat,
      label: t(`catalog_page.category_list.${cat}`)
    }))
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data as Product[]);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const subscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const featuredProducts = products.filter(p => p.is_featured);

  return (
    <div className="bg-white min-h-screen">
      {/* Featured Slider Section */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-blue-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <h2 className="text-2xl font-bold text-aftras-blue-border">{t('catalog_page.featured')}</h2>
            <p className="text-gray-600">{t('catalog_page.featured_desc')}</p>
          </div>
          <ProductSlider products={featuredProducts} />
        </section>
      )}

      {/* Main Catalog */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-aftras-blue-border mb-4 flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-aftras-orange" /> {t('catalog_page.categories')}
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id 
                            ? 'bg-aftras-blue-text text-white font-bold' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-3xl font-bold text-aftras-blue-border">{t('catalog_page.title')}</h1>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('catalog_page.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-aftras-blue-text focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aftras-blue-text" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-aftras-orange overflow-hidden group hover:shadow-xl transition-all">
                      <div className="h-56 overflow-hidden relative">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-aftras-blue-text uppercase tracking-widest">
                          {t(`catalog_page.category_list.${product.category}`)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                          {product.description || t('catalog_page.default_desc')}
                        </p>
                        <Link 
                          to="/loi" 
                          state={{ product: product.name }}
                          className="w-full flex items-center justify-center bg-aftras-orange text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {t('catalog_page.request_loi')}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg">{t('catalog_page.no_products')}</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};
