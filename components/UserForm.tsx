
import React, { useState, useEffect } from 'react';
import { User, UserStatus } from '../types';

interface UserFormProps {
    user: User | null;
    onSave: (user: User & {id: number | null}) => void;
    onCancel: () => void;
}

const emptyUser: Omit<User, 'id'> = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Viewer',
    status: UserStatus.Pending,
    avatar: ''
};

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<User, 'id'> & {id: number | null}>({
        ...emptyUser,
        id: null
    });

    useEffect(() => {
        if(user) {
            setFormData(user);
        } else {
            setFormData({ 
                ...emptyUser, 
                avatar: `https://picsum.photos/seed/${Date.now()}/50/50`,
                id: null
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                        <h3 className="text-2xl font-semibold text-text-primary mb-4">{user ? 'Edit User' : 'Add New User'}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Password</label>
                                <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleChange} placeholder={user ? 'Leave blank to keep current' : 'Enter password'} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-secondary">Phone Number</label>
                                <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="role" className="block text-sm font-medium text-text-secondary">Role</label>
                                <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    <option>Admin</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="status" className="block text-sm font-medium text-text-secondary">Status</label>
                                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    <option>{UserStatus.Active}</option>
                                    <option>{UserStatus.Inactive}</option>
                                    <option>{UserStatus.Pending}</option>
                                </select>
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
                            Save User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
