import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div>
      <Header onLogout={onLogout} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
