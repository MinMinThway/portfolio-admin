import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import UsersView from './components/UsersView';
import CompanyProfileView from './components/CompanyProfileView';
import ShopsView from './components/ShopsView';
import NewsView from './components/NewsView';
import PrivacyPolicyView from './components/PrivacyPolicyView';
import LoginView from './components/LoginView';
import CategoryView from './components/CategoryView';
import GoldProductsView from './components/GoldProductsView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (email: string, password: string): boolean => {
    // In a real application, this would involve an API call.
    // For this demo, we use hardcoded credentials.
    if (email === 'admin@example.com' && password === 'password') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Potentially clear any user session data here
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background font-sans text-text-primary">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden"></div>}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(p => !p)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            {activeView === 'Dashboard' && <DashboardView />}
            {activeView === 'Users' && <UsersView />}
            {activeView === 'Company Profile' && <CompanyProfileView />}
            {activeView === 'Shops' && <ShopsView />}
            {activeView === 'News' && <NewsView />}
            {activeView === 'Categories' && <CategoryView />}
            {activeView === 'Gold Products' && <GoldProductsView />}
            {activeView === 'Privacy and Policy' && <PrivacyPolicyView />}
            {/* Other views can be added here based on activeView state */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
