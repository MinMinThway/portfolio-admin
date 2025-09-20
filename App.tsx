import React, { useState, useEffect } from 'react';
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
import { AUTH_API_ROUTES } from './config/apiRoutes';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        // In a real application, you might want to validate the token here.
        setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch(AUTH_API_ROUTES.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.token) {
                localStorage.setItem('authToken', data.token);
                setIsAuthenticated(true);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Login request failed:', error);
        return false;
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    try {
        await fetch(AUTH_API_ROUTES.LOGOUT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    } catch (error) {
        console.error('Logout request failed:', error);
        // We still want to log the user out on the client-side
    } finally {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
    }
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