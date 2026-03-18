import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { Search, Filter, ShoppingCart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductSlider } from '../components/ProductSlider';

const CATEGORIES = [
  'Tous',
  'Céréales & Grains',
  'Légumineuses',
  'Noix & Oléagineux',
  'Produits d’export',
  'Épices & Condiments',
  'Fruits & Légumes',
  'Produits transformés'
];

export const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="bg-white min-h-screen">
      {/* Featured Slider Section */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-blue-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <h2 className="text-2xl font-bold text-aftras-blue-border">Produits Vedettes</h2>
            <p className="text-gray-600">Sélection exclusive de produits à fort potentiel.</p>
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
                    <Filter className="w-4 h-4 mr-2 text-aftras-orange" /> Catégories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat 
                            ? 'bg-aftras-blue-text text-white font-bold' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-3xl font-bold text-aftras-blue-border">Catalogue Produits</h1>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
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
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-aftras-blue-text uppercase tracking-widest">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-6">
                          {product.description || "Produit de haute qualité sourcé par nos experts pour vos besoins d'import-export."}
                        </p>
                        <Link 
                          to="/loi" 
                          state={{ product: product.name }}
                          className="w-full flex items-center justify-center bg-aftras-orange text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Demander LOI
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 text-lg">Aucun produit trouvé pour cette sélection.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};
