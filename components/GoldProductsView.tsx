import React, { useState, useEffect } from 'react';
import { GoldProduct, Category, GoldQuality, ProductType } from '../types';
import { EditIcon, TrashIcon } from '../constants';
import GoldProductForm from './GoldProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, getGoldQualities, getProductTypes } from '../services/api';

const GoldProductsView: React.FC = () => {
    const [products, setProducts] = useState<GoldProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [goldQualities, setGoldQualities] = useState<GoldQuality[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<GoldProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [fetchedProducts, fetchedCategories, fetchedQualities, fetchedTypes] = await Promise.all([
                getProducts(),
                getCategories(),
                getGoldQualities(),
                getProductTypes(),
            ]);
            setProducts(fetchedProducts || []);
            setCategories(fetchedCategories || []);
            setGoldQualities(fetchedQualities || []);
            setProductTypes(fetchedTypes || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditProduct = (product: GoldProduct) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteProduct = async (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId);
                await fetchData();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete product.';
                setError(errorMessage);
            }
        }
    };

    const handleSaveProduct = async (productToSave: GoldProduct & {id: number | null}) => {
        try {
            const payload = {
                ...productToSave,
                user: "admin@example.com",
                createdBy: "admin@example.com"
            };

            if(productToSave.id === null){
                const { id, ...newProductData } = payload;
                await createProduct(newProductData);
            } else {
                await updateProduct({ ...payload, id: productToSave.id });
            }
            setIsFormOpen(false);
            await fetchData();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save product.';
            setError(errorMessage);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const getCategoryName = (categoryId: number) => {
        return categories.find(c => c.id === categoryId)?.name || 'N/A';
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-3xl font-bold text-text-primary">Gold Product Management</h3>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
                >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Product
                </button>
            </div>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-card rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6 text-center text-text-secondary">Loading products...</div>
                    ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Gold Quality</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {products.length > 0 ? products.map(product => (
                               <tr key={product.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                           <div className="flex-shrink-0 h-10 w-10">
                                               <img className="h-10 w-10 rounded-md object-cover" src={product.photo} alt={product.productName} />
                                           </div>
                                           <div className="ml-4">
                                               <div className="text-sm font-medium text-text-primary">{product.productName}</div>
                                           </div>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden md:table-cell">{getCategoryName(product.categoryId)}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${product.estimatePrice.toFixed(2)}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden sm:table-cell">{product.goldQuality}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                       <div className="flex items-center justify-end space-x-4">
                                            <button onClick={() => handleEditProduct(product)} className="text-primary hover:text-indigo-900" aria-label={`Edit ${product.productName}`}>
                                                <EditIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${product.productName}`}>
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                       </div>
                                   </td>
                               </tr>
                           )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-text-secondary">
                                        No products found.
                                    </td>
                                </tr>
                           )}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

            {isFormOpen && <GoldProductForm product={editingProduct} categories={categories} goldQualities={goldQualities} productTypes={productTypes} onSave={handleSaveProduct} onCancel={handleCancel} />}
        </div>
    );
};
export default GoldProductsView;
