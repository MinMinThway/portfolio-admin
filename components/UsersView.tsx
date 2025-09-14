
import React, { useState } from 'react';
import { User, UserStatus } from '../types';
import { EditIcon, TrashIcon } from '../constants';
import UserForm from './UserForm';

const initialUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://picsum.photos/id/1005/50/50', role: 'Admin', status: UserStatus.Active, phoneNumber: '555-0101' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://picsum.photos/id/1011/50/50', role: 'Editor', status: UserStatus.Active, phoneNumber: '555-0102' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', avatar: 'https://picsum.photos/id/1012/50/50', role: 'Viewer', status: UserStatus.Pending, phoneNumber: '555-0103' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', avatar: 'https://picsum.photos/id/1013/50/50', role: 'Editor', status: UserStatus.Inactive, phoneNumber: '555-0104' },
  { id: 5, name: 'Chris Green', email: 'chris.green@example.com', avatar: 'https://picsum.photos/id/1025/50/50', role: 'Viewer', status: UserStatus.Active, phoneNumber: '555-0105' },
  { id: 6, name: 'Patricia Lebsack', email: 'patricia.l@example.com', avatar: 'https://picsum.photos/id/1027/50/50', role: 'Viewer', status: UserStatus.Active, phoneNumber: '555-0106' },
  { id: 7, name: 'Chelsey Dietrich', email: 'chelsey.d@example.com', avatar: 'https://picsum.photos/id/103/50/50', role: 'Admin', status: UserStatus.Active, phoneNumber: '555-0107' },
];

const getStatusPill = (status: UserStatus) => {
  switch (status) {
    case UserStatus.Active:
      return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Active</span>;
    case UserStatus.Inactive:
      return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">Inactive</span>;
    case UserStatus.Pending:
      return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
    default:
      return null;
  }
};

const UsersView: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleSaveUser = (userToSave: User & {id: number | null}) => {
        if(userToSave.id === null){ // New user
            const newId = Math.max(...users.map(u => u.id), 0) + 1;
            setUsers([...users, {...userToSave, id: newId}]);
        } else { // Existing user
            setUsers(users.map(user => user.id === userToSave.id ? {...userToSave, id: user.id} : user));
        }
        setIsFormOpen(false);
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
            
            <div className="bg-card rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
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
                           {users.map(user => (
                               <tr key={user.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="flex items-center">
                                           <div className="flex-shrink-0 h-10 w-10">
                                               <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
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
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormOpen && <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCancel} />}
        </div>
    );
};

export default UsersView;
