import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <span className="legal-tag">LEGAL</span>
          <h1>Privacy Policy</h1>
          <p className="legal-update-date">Last updated: June 27, 2026</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
              <li><strong>Order Information:</strong> Shipping address, payment method details (we do not store full card numbers), and order history.</li>
              <li><strong>Communication Data:</strong> Messages you send us via the contact form or by email.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, products viewed, and time spent.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfil your orders and send order confirmations</li>
              <li>Create and manage your account</li>
              <li>Send you newsletters and promotional offers (only if you opt in)</li>
              <li>Respond to your questions and provide customer support</li>
              <li>Improve our website, products, and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your
              information with trusted third-party service providers who assist us in operating our website
              and delivering our services (e.g., payment processors and shipping companies). These third parties
              are bound by confidentiality agreements and may not use your information for any other purpose.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies
              are small data files stored on your device that help us remember your preferences and understand
              how you use our site. You can control cookie settings through your browser settings, though
              disabling cookies may limit certain website functionality.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from
              unauthorized access, disclosure, alteration, or destruction. Your account is protected by a
              password, and we use encryption (HTTPS) for all data transmitted between your browser and our
              servers. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide
              services to you. You may request deletion of your account and associated data at any time by
              contacting us. We may retain certain information as required by law or for legitimate business
              purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications at any time</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy
              practices of these sites and encourage you to read their privacy policies before providing any
              personal information.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              by posting the new policy on our website with an updated effective date. Your continued use of
              our services after such changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please{' '}
              <Link to="/contact">contact us</Link> or email us at <strong>privacy@velora.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
