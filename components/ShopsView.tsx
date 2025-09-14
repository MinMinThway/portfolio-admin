import React, { useState, useEffect } from 'react';
import { Shop } from '../types';
import { EditIcon, TrashIcon } from '../constants';
import ShopForm from './ShopForm';
import { getShops, createShop, updateShop, deleteShop } from '../services/api';

const ShopsView: React.FC = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingShop, setEditingShop] = useState<Shop | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchShops = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedShops = await getShops();
            setShops(fetchedShops || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shops.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const handleAddShop = () => {
        setEditingShop(null);
        setIsFormOpen(true);
    };

    const handleEditShop = (shop: Shop) => {
        setEditingShop(shop);
        setIsFormOpen(true);
    };

    const handleDeleteShop = async (shopId: number) => {
        if (window.confirm('Are you sure you want to delete this shop?')) {
            try {
                await deleteShop(shopId);
                await fetchShops();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete shop.';
                setError(errorMessage);
            }
        }
    };

    const handleSaveShop = async (shopToSave: Shop & {id: number | null}) => {
        try {
            if(shopToSave.id === null){ // New shop
                const { id, ...newShopData } = shopToSave;
                await createShop(newShopData);
            } else { // Existing shop
                await updateShop({ ...shopToSave, id: shopToSave.id });
            }
            setIsFormOpen(false);
            await fetchShops();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save shop.';
            setError(errorMessage);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingShop(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-3xl font-bold text-text-primary">Shop Management</h3>
                <button
                    onClick={handleAddShop}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
                >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Shop
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
                        <div className="p-6 text-center text-text-secondary">Loading shops...</div>
                    ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Address</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Phone</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {shops.length > 0 ? shops.map(shop => (
                               <tr key={shop.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                           <div className="flex-shrink-0 h-10 w-16">
                                               <img className="h-10 w-16 rounded object-cover" src={shop.photoUrl} alt={shop.location} />
                                           </div>
                                           <div className="ml-4">
                                               <div className="text-sm font-medium text-text-primary">{shop.location}</div>
                                                <a href={shop.mapLink} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                                                  View Map
                                                </a>
                                           </div>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-normal text-sm text-text-secondary max-w-xs">{shop.address}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden sm:table-cell">{shop.phone}</td>
                                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                       <div className="flex items-center justify-end space-x-4">
                                            <button onClick={() => handleEditShop(shop)} className="text-primary hover:text-indigo-900" aria-label={`Edit ${shop.location}`}>
                                                <EditIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteShop(shop.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${shop.location}`}>
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                       </div>
                                   </td>
                               </tr>
                           )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-text-secondary">
                                        No shops found.
                                    </td>
                                </tr>
                           )}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>

            {isFormOpen && <ShopForm shop={editingShop} onSave={handleSaveShop} onCancel={handleCancel} />}
        </div>
    );
};

export default ShopsView;
