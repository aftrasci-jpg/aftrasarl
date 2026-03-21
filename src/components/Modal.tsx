import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'info'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className={`p-6 ${type === 'danger' ? 'bg-red-50' : 'bg-blue-50'} flex items-center justify-between`}>
              <div className="flex items-center">
                <AlertTriangle className={`w-6 h-6 mr-3 ${type === 'danger' ? 'text-red-600' : 'text-blue-600'}`} />
                <h3 className={`text-lg font-bold ${type === 'danger' ? 'text-red-900' : 'text-blue-900'}`}>{title}</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">{message}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                    type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-aftras-blue-text hover:bg-opacity-90'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
