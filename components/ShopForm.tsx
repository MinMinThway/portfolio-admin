
import React, { useState, useEffect } from 'react';
import { Shop } from '../types';

interface ShopFormProps {
    shop: Shop | null;
    onSave: (shop: Shop & {id: number | null}) => void;
    onCancel: () => void;
}

const emptyShop: Omit<Shop, 'id'> = {
    location: '',
    address: '',
    mapLink: '',
    phone: '',
    photoUrl: '',
    remarks: ''
};

const ShopForm: React.FC<ShopFormProps> = ({ shop, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Shop, 'id'> & {id: number | null}>({
        ...emptyShop,
        id: null
    });

    useEffect(() => {
        if(shop) {
            setFormData(shop);
        } else {
            setFormData({ 
                ...emptyShop, 
                photoUrl: `https://picsum.photos/seed/${Date.now()}/200/100`,
                id: null
            });
        }
    }, [shop]);

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
                        <h3 className="text-2xl font-semibold text-text-primary mb-4">{shop ? 'Edit Shop' : 'Add New Shop'}</h3>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="location" className="block text-sm font-medium text-text-secondary">Location Name</label>
                                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">Phone Number</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-text-secondary">Address</label>
                                <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="mapLink" className="block text-sm font-medium text-text-secondary">Map Link (URL)</label>
                                <input type="url" name="mapLink" id="mapLink" value={formData.mapLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="photoUrl" className="block text-sm font-medium text-text-secondary">Photo (URL)</label>
                                <input type="url" name="photoUrl" id="photoUrl" value={formData.photoUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="remarks" className="block text-sm font-medium text-text-secondary">Remarks</label>
                                <textarea name="remarks" id="remarks" value={formData.remarks} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
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
                            Save Shop
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopForm;