
import React from 'react';
import StatCard from './StatCard';
import SalesChart from './SalesChart';
import UserTable from './UserTable';
import { StatCardData } from '../types';

const DollarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
const UsersIcon: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const CartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);
const ActivityIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);


const statCards: StatCardData[] = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", changeType: 'positive', icon: <DollarIcon className="h-8 w-8 text-primary" /> },
    { title: "New Users", value: "+2,350", change: "+180.1%", changeType: 'positive', icon: <UsersIcon className="h-8 w-8 text-green-500" /> },
    { title: "Total Sales", value: "+12,234", change: "+19%", changeType: 'positive', icon: <CartIcon className="h-8 w-8 text-blue-500" /> },
    { title: "Active Now", value: "573", change: "-2.3%", changeType: 'negative', icon: <ActivityIcon className="h-8 w-8 text-red-500" /> },
]

const DashboardView: React.FC = () => {
  return (
    <div>
      <h3 className="text-3xl font-bold text-text-primary">Dashboard</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {statCards.map(card => <StatCard key={card.title} data={card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <SalesChart />
        </div>
        <div className="lg:col-span-2">
            <UserTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
