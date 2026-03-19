import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductTranslation } from '../utils/translation';

interface ProductSliderProps {
  products: Product[];
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
  const { t } = useTranslation();
  const { translateProductName, translateProductCategory } = useProductTranslation();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (products.length === 0) return;
    
    const timer = setInterval(() => {
      if (!isPaused) {
        setCurrent((prev) => (prev + 1) % products.length);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [products.length, isPaused]);

  const next = () => setCurrent((prev) => (prev + 1) % products.length);
  const prev = () => setCurrent((prev) => (prev - 1 + products.length) % products.length);
  const goTo = (index: number) => setCurrent(index);

  if (products.length === 0) return null;

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
          <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="relative h-[200px] md:h-[250px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img 
            src={products[current].image_url}
            alt={translateProductName(products[current].name)}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <span className="inline-block bg-aftras-orange/90 text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
              {translateProductCategory(products[current].category)}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
              {translateProductName(products[current].name)}
            </h3>
            <Link 
              to="/loi" 
              state={{ product: translateProductName(products[current].name) }}
              className="inline-flex items-center bg-aftras-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              onClick={() => setIsPaused(true)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {t('catalog_page.request_loi')}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur hover:bg-white text-aftras-blue-text shadow-lg transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur hover:bg-white text-aftras-blue-text shadow-lg transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index ? 'bg-aftras-orange w-8 shadow-lg' : 'bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
