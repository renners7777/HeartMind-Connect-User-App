import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col flex-grow">
      <Header onLogout={onLogout} />
      <main className="pt-16 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
