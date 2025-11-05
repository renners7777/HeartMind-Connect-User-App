import React, { useState } from 'react';
import styled from 'styled-components';
import PrivacyPolicy from './PrivacyPolicy';

const FooterContainer = styled.footer`
  background-color: #111827;
  color: #d1d5db;
  padding: 2rem 1rem;
`;

const FooterContent = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const TextBlock = styled.div`
  font-size: 0.875rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const FooterButton = styled.button`
  font-size: 0.875rem;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const CopyrightText = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const Footer: React.FC = () => {
    const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

    return (
        <>
            <FooterContainer>
                <FooterContent>
                    <TextBlock>
                    Created by Chris Renshaw using Google AI Studio and Firebase Studio.
                    </TextBlock>
                    <LinkContainer>
                        <FooterLink href="mailto:CRSoftwareEngineer@outlook.com">Contact</FooterLink>
                        <FooterLink href="https://www.linkedin.com/in/chris-renshaw-renners7777/" target="_blank" rel="noopener noreferrer">LinkedIn</FooterLink>
                        <FooterLink href="https://github.com/renners7777" target="_blank" rel="noopener noreferrer">Github</FooterLink>
                        <FooterLink href="https://www.chrisrenshaw.net/" target="_blank" rel="noopener noreferrer">Website</FooterLink>
                        <FooterButton onClick={() => setPrivacyPolicyOpen(true)}>Privacy Policy</FooterButton>
                    </LinkContainer>
                    <CopyrightText>
                    Copyright © Chris Renshaw {new Date().getFullYear()}.
                    </CopyrightText>
                </FooterContent>
            </FooterContainer>
            {privacyPolicyOpen && <PrivacyPolicy onClose={() => setPrivacyPolicyOpen(false)} />}
        </>
    );
};

export default Footer;