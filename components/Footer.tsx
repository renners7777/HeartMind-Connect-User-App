import React, { useState } from 'react';
import styled from 'styled-components';
import PrivacyPolicy from './PrivacyPolicy';

const FooterContainer = styled.footer`
  background-color: #111827; // bg-gray-900
  color: #9ca3af; // text-gray-400
  padding: 2rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

const FooterContent = styled.div`
  max-width: 80rem; // max-w-7xl
  margin: 0 auto;
  text-align: center;
`;

const TextBlock = styled.p`
  margin-bottom: 1rem;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  color: #d1d5db; // text-gray-300
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: #ffffff;
  }
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  color: #d1d5db; // text-gray-300
  text-decoration: none;
  padding: 0;
  font-size: inherit;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #ffffff;
  }
`;

const CopyrightText = styled.p`
    margin-top: 1rem;
    font-size: 0.75rem; /* text-xs */
    color: #6b7280; /* text-gray-500 */
`;


const Footer: React.FC = () => {
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

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
                Copyright © Chris Renshaw 2025.
                </CopyrightText>
            </FooterContent>
        </FooterContainer>
        {isPrivacyPolicyOpen && <PrivacyPolicy onClose={() => setPrivacyPolicyOpen(false)} />}
    </>
  );
};

export default Footer;
