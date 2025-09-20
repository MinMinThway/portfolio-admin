import React, { useState, useEffect } from 'react';
import { GoldProduct, Category, GoldQuality, ProductType } from '../types';

interface GoldProductFormProps {
    product: GoldProduct | null;
    categories: Category[];
    goldQualities: GoldQuality[];
    productTypes: ProductType[];
    onSave: (product: GoldProduct & {id: number | null}) => void;
    onCancel: () => void;
}

const emptyProduct: Omit<GoldProduct, 'id'> = {
    productName: '',
    productDescription: '',
    goldQuality: '',
    productType: '',
    estimatePrice: 0,
    specification: '',
    photo: '',
    categoryId: 0,
};

const GoldProductForm: React.FC<GoldProductFormProps> = ({ product, categories, goldQualities, productTypes, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<GoldProduct, 'id'> & {id: number | null}>({
        ...emptyProduct,
        id: null
    });

    useEffect(() => {
        if(product) {
            setFormData(product);
        } else {
            setFormData({ 
                ...emptyProduct, 
                categoryId: categories.length > 0 ? categories[0].id : 0,
                goldQuality: goldQualities.length > 0 ? goldQualities[0].name : '',
                productType: productTypes.length > 0 ? productTypes[0].name : '',
                photo: `https://picsum.photos/seed/${Date.now()}/400/300`,
                id: null
            });
        }
    }, [product, categories, goldQualities, productTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'estimatePrice' ? parseFloat(value) : name === 'categoryId' ? parseInt(value, 10) : value;
        setFormData(prev => ({...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.categoryId === 0 && categories.length > 0) {
            alert("Please select a category.");
            return;
        }
        onSave(formData);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto" role="document">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-text-primary mb-6">{product ? 'Edit Product' : 'Add New Product'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-text-secondary">Product Name</label>
                                <input type="text" name="productName" id="productName" value={formData.productName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-text-secondary">Category</label>
                                <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    <option value="0" disabled>Select a category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="productDescription" className="block text-sm font-medium text-text-secondary">Description</label>
                                <textarea name="productDescription" id="productDescription" value={formData.productDescription} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="goldQuality" className="block text-sm font-medium text-text-secondary">Gold Quality</label>
                                <select name="goldQuality" id="goldQuality" value={formData.goldQuality} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    {goldQualities.map(q => (
                                        <option key={q.id} value={q.name}>{q.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="productType" className="block text-sm font-medium text-text-secondary">Product Type</label>
                                <select name="productType" id="productType" value={formData.productType} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    {productTypes.map(t => (
                                        <option key={t.id} value={t.name}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="estimatePrice" className="block text-sm font-medium text-text-secondary">Estimated Price</label>
                                <input type="number" name="estimatePrice" id="estimatePrice" value={formData.estimatePrice} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="specification" className="block text-sm font-medium text-text-secondary">Specification</label>
                                <input type="text" name="specification" id="specification" value={formData.specification} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="photo" className="block text-sm font-medium text-text-secondary">Photo (URL)</label>
                                <input type="url" name="photo" id="photo" value={formData.photo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg sticky bottom-0">
                         <button 
                            type="button" 
                            onClick={onCancel}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default GoldProductForm;
