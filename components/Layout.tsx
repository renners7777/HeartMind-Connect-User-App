import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  onLogout: () => void;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding-top: 4rem; /* 64px */
  flex-grow: 1;
`;

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <LayoutContainer>
      <Header onLogout={onLogout} />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
