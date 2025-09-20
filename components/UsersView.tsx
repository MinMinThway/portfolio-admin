import React, { useState, useEffect } from 'react';
import { User, UserStatus } from '../types';
import { EditIcon, TrashIcon } from '../constants';
import UserForm from './UserForm';
import { getUsers, registerUser, updateUser, deleteUser } from '../services/api';

const getStatusPill = (status: UserStatus | string) => {
  switch (status) {
    case UserStatus.Active:
      return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Active</span>;
    case UserStatus.Inactive:
      return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">Inactive</span>;
    case UserStatus.Pending:
      return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
    default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
  }
};

const UsersView: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                await fetchUsers();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to delete user.';
                setError(errorMessage);
            }
        }
    };

    const handleSaveUser = async (userToSave: User & {id: number | null}) => {
        try {
            if(userToSave.id === null){ // New user
                const { id, avatar, ...newUser } = userToSave;
                await registerUser(newUser);
            } else { // Existing user
                await updateUser({...userToSave, id: userToSave.id});
            }
            setIsFormOpen(false);
            await fetchUsers();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save user.';
            setError(errorMessage);
        }
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-3xl font-bold text-text-primary">User Management</h3>
                <button
                    onClick={handleAddUser}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors duration-200"
                >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add User
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
                        <div className="p-6 text-center text-text-secondary">Loading users...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Role</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Phone Number</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {users.length > 0 ? users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-text-primary">{user.name}</div>
                                                <div className="text-sm text-text-secondary">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden md:table-cell">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary hidden md:table-cell">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusPill(user.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                                <button onClick={() => handleEditUser(user)} className="text-primary hover:text-indigo-900" aria-label={`Edit ${user.name}`}>
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${user.name}`}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-text-secondary">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isFormOpen && <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCancel} />}
        </div>
    );
};

export default UsersView;