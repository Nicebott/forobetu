import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types/product';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Package, Edit2, Trash2, User, MessageCircle, Clock, DollarSign } from 'lucide-react';
import Button from '../ui/Button';

interface ProductListProps {
  products: Product[];
  darkMode: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  darkMode,
  onEdit,
  onDelete,
  showActions = false
}) => {
  const handleWhatsAppClick = (whatsapp: string, titulo: string) => {
    const formattedNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola, me interesa el producto: ${titulo}`);
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative rounded-xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="relative aspect-w-16 aspect-h-12 overflow-hidden rounded-t-xl">
              <img
                src={product.imagen}
                alt={product.titulo}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-5">
              <div className="mb-3">
                <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.titulo}
                </h3>
                <p className={`text-sm mb-3 line-clamp-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {product.descripcion}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-1 text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Clock size={14} />
                  <span>
                    {formatDistanceToNow(product.creadoEn.toDate(), {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {product.usuarioNombre}
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-between py-3 border-t ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className={`flex items-center gap-1 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  <DollarSign size={20} className="flex-shrink-0" />
                  <span className="text-2xl font-bold">
                    {product.precio.toLocaleString()}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleWhatsAppClick(product.whatsapp, product.titulo)}
                  variant="primary"
                  size="sm"
                  className="relative z-10 flex items-center gap-1 hover:scale-105 transition-transform"
                >
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </Button>
              </div>

              {showActions && (
                <div className={`flex gap-2 mt-3 pt-3 border-t ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <Button
                    onClick={() => onEdit?.(product)}
                    variant="outline"
                    size="sm"
                    className="relative z-10 flex-1 flex items-center justify-center gap-1 hover:scale-105 transition-transform"
                  >
                    <Edit2 size={14} />
                    Editar
                  </Button>
                  <Button
                    onClick={() => onDelete?.(product.id)}
                    variant="outline"
                    size="sm"
                    className={`relative z-10 flex-1 flex items-center justify-center gap-1 hover:scale-105 transition-transform ${
                      darkMode
                        ? 'hover:bg-red-900/30 hover:text-red-400'
                        : 'hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {products.length === 0 && (
        <div className={`col-span-full flex flex-col items-center justify-center py-16 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Package className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No hay productos disponibles</h3>
          <p className="text-sm">¡Sé el primero en publicar un producto!</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;