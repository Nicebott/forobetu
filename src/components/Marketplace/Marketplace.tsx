import React, { useState, useEffect } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { Product, ProductFormData } from '../../types/product';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';
import Button from '../ui/Button';

interface MarketplaceProps {
  darkMode: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ darkMode, setIsAuthModalOpen }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
    setLoading(false);
  };

  const handleNewProduct = () => {
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Producto eliminado exitosamente');
        loadProducts();
      } else {
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const handleSubmitProduct = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        const success = await updateProduct(selectedProduct.id, data);
        if (success) {
          toast.success('Producto actualizado exitosamente');
        } else {
          throw new Error('Error al actualizar el producto');
        }
      } else {
        const productId = await createProduct(data);
        if (productId) {
          toast.success('Producto publicado exitosamente');
        } else {
          throw new Error('Error al crear el producto');
        }
      }
      setShowProductForm(false);
      loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al procesar el producto');
    }
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.titulo.toLowerCase().includes(searchLower) ||
      product.descripcion.toLowerCase().includes(searchLower) ||
      product.usuarioNombre.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Marketplace
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Explora y publica productos para la comunidad estudiantil
          </p>
        </div>
        <Button
          onClick={handleNewProduct}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Publicar Producto
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
        />
      </div>

      {loading ? (
        <div className={`flex flex-col items-center justify-center h-64 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Package className="w-12 h-12 mb-4 animate-pulse" />
          <p className="text-lg font-medium">Cargando productos...</p>
        </div>
      ) : (
        <ProductList
          products={filteredProducts}
          darkMode={darkMode}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          showActions={!!auth.currentUser}
        />
      )}

      <ProductForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleSubmitProduct}
        darkMode={darkMode}
        initialData={selectedProduct || undefined}
      />
    </div>
  );
};

export default Marketplace;