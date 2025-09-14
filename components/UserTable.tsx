
import React from 'react';
import { User, UserStatus } from '../types';

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', avatar: 'https://picsum.photos/id/1005/50/50', role: 'Admin', status: UserStatus.Active, phoneNumber: '555-0101' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://picsum.photos/id/1011/50/50', role: 'Editor', status: UserStatus.Active, phoneNumber: '555-0102' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', avatar: 'https://picsum.photos/id/1012/50/50', role: 'Viewer', status: UserStatus.Pending, phoneNumber: '555-0103' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', avatar: 'https://picsum.photos/id/1013/50/50', role: 'Editor', status: UserStatus.Inactive, phoneNumber: '555-0104' },
  { id: 5, name: 'Chris Green', email: 'chris.green@example.com', avatar: 'https://picsum.photos/id/1025/50/50', role: 'Viewer', status: UserStatus.Active, phoneNumber: '555-0105' },
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

const UserTable: React.FC = () => {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-200 h-full">
      <h4 className="text-xl font-semibold text-text-primary">Recent Users</h4>
      <p className="text-sm text-text-secondary mb-4">A list of the newest members.</p>
      <div className="space-y-4">
        {mockUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="ml-3">
                <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                <p className="text-xs text-text-secondary">{user.email}</p>
              </div>
            </div>
            {getStatusPill(user.status)}
          </div>
        ))}
      </div>
       <button className="mt-6 w-full text-center text-sm font-semibold text-primary hover:underline focus:outline-none">
          View All Users
        </button>
    </div>
  );
};

export default UserTable;
