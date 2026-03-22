import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProductSliderProps {
  products: Product[];
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const { t, i18n } = useTranslation();
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 768) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else if (window.innerWidth < 1280) setVisibleCount(4);
      else setVisibleCount(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (products.length <= visibleCount) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [products.length, visibleCount]);

  const next = () => setStartIndex((prev) => (prev + 1) % products.length);
  const prev = () => setStartIndex((prev) => (prev - 1 + products.length) % products.length);

  if (products.length === 0) return null;

  const visibleProducts = [];
  const count = Math.min(visibleCount, products.length);
  for (let i = 0; i < count; i++) {
    visibleProducts.push(products[(startIndex + i) % products.length]);
  }

  return (
    <div className="relative group px-2 md:px-12">
      <div className="flex gap-3 md:gap-6 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleProducts.map((product, idx) => {
            const productName = i18n.language === 'en' && product.name_en ? product.name_en : product.name;
            
            return (
              <motion.div
                key={`${product.id}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex-1 min-w-0"
              >
                <div className="bg-white rounded-xl shadow-lg border border-aftras-orange/30 overflow-hidden h-full flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={product.image_url} 
                      alt={productName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-aftras-orange text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      {t('catalog_page.featured_badge')}
                    </div>
                  </div>
                  <div className="p-2 md:p-4 flex-grow">
                    <span className="text-[8px] md:text-xs font-semibold text-aftras-blue-text uppercase tracking-wider">
                      {t(`catalog_page.category_list.${product.category}`)}
                    </span>
                    <h3 className="text-sm md:text-lg font-bold text-gray-900 mt-1 line-clamp-1">{productName}</h3>
                  </div>
                  <div className="p-2 md:p-4 pt-0">
                    <Link 
                      to="/loi" 
                      state={{ product: productName, product_image: product.image_url }}
                      className="w-full flex items-center justify-center bg-aftras-orange text-white py-1.5 md:py-2 rounded-lg text-[10px] md:text-sm font-bold hover:bg-opacity-90 transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      {t('catalog_page.request_loi')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {products.length > visibleCount && (
        <>
          <button 
            onClick={prev} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 md:p-2 rounded-full bg-white/90 shadow-md text-aftras-blue-text hover:bg-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 -ml-2 md:ml-0"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 md:p-2 rounded-full bg-white/90 shadow-md text-aftras-blue-text hover:bg-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 -mr-2 md:mr-0"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </>
      )}
    </div>
  );
};
