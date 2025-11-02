import React from 'react';
import styled from 'styled-components';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: #111827; // bg-gray-900
  color: #d1d5db; // text-gray-300
  padding: 2rem;
  border-radius: 0.5rem;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  h1, h2, h3 {
    font-weight: bold;
    color: #ffffff; // text-white
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h1 {
    font-size: 1.875rem; // text-3xl
  }

  h2 {
    font-size: 1.5rem; // text-2xl
  }
  
  h3 {
    font-size: 1.25rem; // text-xl
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: #93c5fd; // text-blue-300
    text-decoration: underline;
  }

  ul {
    list-style-type: disc;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #d1d5db; // text-gray-300
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ffffff; // text-white
  }
`;

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> 24th July 2024</p>

        <p>
            Welcome to HeartMind, an application designed to support stroke survivors and their companions. 
            This Privacy Policy explains how we collect, use, and disclose your information when you use our services.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>a. Personal Information</h3>
        <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and chosen password. This information is used for authentication and to personalize your experience.</li>
            <li><strong>User Profile:</strong> You may choose to provide additional information, such as a profile picture or contact details, which will be visible to your linked companion.</li>
        </ul>

        <h3>b. Health and Wellness Information</h3>
        <ul>
            <li><strong>Journal Entries:</strong> You can record your thoughts, feelings, and experiences in your personal journal. These entries are encrypted and stored securely.</li>
            <li><strong>Task and Goal Progress:</strong> We track your progress on tasks and goals to help you monitor your recovery journey. This may include information about your physical and cognitive activities.</li>
            <li><strong>Mood and Symptom Tracking:</strong> The app allows you to log your mood and any symptoms you may be experiencing. This information is used to provide insights into your well-being.</li>
        </ul>

        <h3>c. Companion-Provided Information</h3>
        <ul>
            <li><strong>Observations and Notes:</strong> Your companion may record observations and notes about your progress and well-being. This information is shared with you to facilitate communication and collaborative care.</li>
        </ul>

        <h3>d. Technical Information</h3>
        <ul>
            <li><strong>Usage Data:</strong> We collect information about how you interact with the app, such as the features you use, the time and duration of your sessions, and any errors that occur.</li>
            <li><strong>Device Information:</strong> We may collect information about your device, including its model, operating system, and unique identifiers, to improve our services and provide technical support.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
            <li><strong>To Provide and Improve Our Services:</strong> We use your information to deliver the app's features, personalize your experience, and develop new tools to support your recovery.</li>
            <li><strong>To Facilitate Communication:</strong> Your information is used to connect you with your companion and enable seamless communication within the app.</li>
            <li><strong>For Research and Development:</strong> Anonymized and aggregated data may be used for research purposes to advance the understanding of stroke recovery and improve the effectiveness of our app. No personally identifiable information will be shared.</li>
            <li><strong>To Ensure Security:</strong> We use your information to protect your account and our services from unauthorized access and fraudulent activity.</li>
        </ul>

        <h2>3. Information Sharing and Disclosure</h2>
        <ul>
            <li><strong>With Your Companion:</strong> Your profile information, task progress, and companion-provided notes are shared with your linked companion to foster a supportive and collaborative environment.</li>
            <li><strong>With Your Consent:</strong> We may share your information with third parties if you have given us explicit consent to do so.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to a valid legal request, such as a court order or subpoena.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
            We take the security of your information seriously and have implemented robust measures to protect it from unauthorized access, disclosure, or alteration. These measures include:
        </p>
        <ul>
            <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using industry-standard protocols. Your journal entries and other sensitive information are also encrypted at rest.</li>
            <li><strong>Access Controls:</strong> We have strict access controls in place to ensure that only authorized personnel can access your information.</li>
        </ul>

        <h2>5. Your Rights and Choices</h2>
        <ul>
            <li><strong>Access and Update:</strong> You can access and update your personal information through your account settings.</li>
            <li><strong>Data Portability:</strong> You have the right to request a copy of your data in a machine-readable format.</li>
            <li><strong>Account Deletion:</strong> You can delete your account at any time. Please note that some anonymized data may be retained for research and analytical purposes.</li>
        </ul>

        <h2>6. Third-Party Services</h2>
        <p>
            Our app may contain links to third-party websites or services. This Privacy Policy does not apply to the practices of those third parties, and we encourage you to review their privacy policies before providing them with your information.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with their information, we will take steps to delete it.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website or through the app.
        </p>

        <h2>9. Contact Us</h2>
        <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:CRSoftwareEngineer@outlook.com">CRSoftwareEngineer@outlook.com</a>.
        </p>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PrivacyPolicy;
