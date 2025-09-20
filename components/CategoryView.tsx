
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { EditIcon, TrashIcon } from '../constants';
import CategoryForm from './CategoryForm';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const CategoryView: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(categoryId);
                await fetchCategories();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete category.';
                setError(errorMessage);
            }
        }
    };

    const handleSaveCategory = async (categoryToSave: Category & {id: number | null}) => {
        try {
            if(categoryToSave.id === null){ // New category
                const { id, ...newCategoryData } = categoryToSave;
                await createCategory(newCategoryData);
            } else { // Existing category
                await updateCategory({ ...categoryToSave, id: categoryToSave.id });
            }
            setIsFormOpen(false);
            await fetchCategories();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save category.';
            setError(errorMessage);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-3xl font-bold text-text-primary">Category Management</h3>
                <button
                    onClick={handleAddCategory}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
                >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Category
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
                        <div className="p-6 text-center text-text-secondary">Loading categories...</div>
                    ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Description</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {categories.length > 0 ? categories.map(category => (
                               <tr key={category.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                           <div className="flex-shrink-0 h-10 w-10">
                                               <img className="h-10 w-10 rounded-full object-cover" src={category.photoUrl} alt={category.name} />
                                           </div>
                                           <div className="ml-4">
                                               <div className="text-sm font-medium text-text-primary">{category.name}</div>
                                           </div>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-normal text-sm text-text-secondary hidden sm:table-cell max-w-md">{category.description}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                       <div className="flex items-center justify-end space-x-4">
                                            <button onClick={() => handleEditCategory(category)} className="text-primary hover:text-indigo-900" aria-label={`Edit ${category.name}`}>
                                                <EditIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${category.name}`}>
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                       </div>
                                   </td>
                               </tr>
                           )) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-text-secondary">
                                        No categories found.
                                    </td>
                                </tr>
                           )}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

            {isFormOpen && <CategoryForm category={editingCategory} onSave={handleSaveCategory} onCancel={handleCancel} />}
        </div>
    );
};

export default CategoryView;
