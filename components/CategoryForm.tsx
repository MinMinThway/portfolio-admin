
import React, { useState, useEffect } from 'react';
import { Category } from '../types';

interface CategoryFormProps {
    category: Category | null;
    onSave: (category: Category & {id: number | null}) => void;
    onCancel: () => void;
}

const emptyCategory: Omit<Category, 'id'> = {
    name: '',
    description: '',
    photoUrl: '',
};

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Category, 'id'> & {id: number | null}>({
        ...emptyCategory,
        id: null
    });

    useEffect(() => {
        if(category) {
            setFormData(category);
        } else {
            setFormData({ 
                ...emptyCategory, 
                photoUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
                id: null
            });
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" role="document">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-text-primary mb-4">{category ? 'Edit Category' : 'Add New Category'}</h3>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Category Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="photoUrl" className="block text-sm font-medium text-text-secondary">Photo (URL)</label>
                                <input type="url" name="photoUrl" id="photoUrl" value={formData.photoUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
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
                            Save Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
