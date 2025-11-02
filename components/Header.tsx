import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../types';

interface HeaderProps {
  onLogout: () => void;
}

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  height: 4rem; /* 64px */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 3rem; /* 48px */
  width: 3rem; /* 48px */
  margin-right: 0.5rem;
`;

const Nav = styled.nav`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    gap: 1rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;

  &:hover {
    background-color: #374151;
    color: #ffffff;
  }

  &.active {
    background-color: #111827;
    color: #ffffff;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #dc2626;
  }
`;

const LogoutText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  display: none;
  @media (min-width: 640px) {
    display: inline;
  }
`;

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src="/logo.png" alt="HeartMind Connect Logo" />
        <Nav>
          <StyledNavLink to={Page.Home}>Home</StyledNavLink>
          <StyledNavLink to={Page.Tasks}>Tasks</StyledNavLink>
          <StyledNavLink to={Page.Chat}>Chat</StyledNavLink>
          <StyledNavLink to={Page.Journal}>Journal</StyledNavLink>
          <StyledNavLink to={Page.Progress}>Progress</StyledNavLink>
          <StyledNavLink to={Page.MemoryGame}>Memory Game</StyledNavLink>
        </Nav>
      </LogoContainer>
      <LogoutButton onClick={onLogout} aria-label="Logout">
        <LogoutText>Logout</LogoutText>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </LogoutButton>
    </HeaderContainer>
  );
};

export default Header;
