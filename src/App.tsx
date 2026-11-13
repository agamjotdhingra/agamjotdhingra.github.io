import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  if (path === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (path === '/admin') {
    return <AdminDashboardPage />;
  }

  // Public portfolio view (kept completely intact)
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0c] font-sans text-zinc-200 selection:bg-zinc-800 selection:text-zinc-100">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;
