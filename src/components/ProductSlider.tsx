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
  const { t } = useTranslation();
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else if (window.innerWidth < 1280) setVisibleCount(3);
      else setVisibleCount(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [products.length]);

  const next = () => setStartIndex((prev) => (prev + 1) % products.length);
  const prev = () => setStartIndex((prev) => (prev - 1 + products.length) % products.length);

  if (products.length === 0) return null;

  const visibleProducts = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleProducts.push(products[(startIndex + i) % products.length]);
  }

  return (
    <div className="relative group px-12">
      <div className="flex gap-6 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product, idx) => (
            <motion.div
              key={`${product.id}-${idx}`}
              layout
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 min-w-0"
            >
              <div className="bg-white rounded-xl shadow-lg border border-aftras-orange overflow-hidden h-full flex flex-col transition-transform hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-aftras-orange text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {t('catalog_page.featured_badge')}
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <span className="text-xs font-semibold text-aftras-blue-text uppercase tracking-wider">
                    {t(`catalog_page.category_list.${product.category}`)}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 line-clamp-1">{product.name}</h3>
                </div>
                <div className="p-4 pt-0">
                  <Link 
                    to="/loi" 
                    state={{ product: product.name }}
                    className="w-full flex items-center justify-center bg-aftras-orange text-white py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {t('catalog_page.request_loi')}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-aftras-blue-text hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-aftras-blue-text hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
