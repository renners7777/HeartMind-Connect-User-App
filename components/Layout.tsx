import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';

interface LayoutProps {
  onLogout: () => void;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
    </LayoutContainer>
  );
};

export default Layout;
