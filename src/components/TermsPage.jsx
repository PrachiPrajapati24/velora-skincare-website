import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPages.css';

const TermsPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <span className="legal-tag">LEGAL</span>
          <h1>Terms &amp; Conditions</h1>
          <p className="legal-update-date">Last updated: June 27, 2026</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Velora website and purchasing our products, you agree to be bound by
              these Terms and Conditions. If you do not agree with any part of these terms, you may not use
              our services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Use of the Website</h2>
            <p>
              You must be at least 18 years of age to use this website. By agreeing to these Terms, you
              represent and warrant that you are at least 18 years old. You are responsible for maintaining
              the security of your account credentials and for all activities that occur under your account.
            </p>
            <ul>
              <li>You agree to provide accurate and complete registration information.</li>
              <li>You must not use the site for any unlawful or unauthorised purpose.</li>
              <li>You must not transmit any viruses, malware, or harmful code.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Products and Pricing</h2>
            <p>
              All product prices are displayed in Indian Rupees (₹) and are inclusive of applicable taxes.
              We reserve the right to modify prices at any time without prior notice. In the event of a
              pricing error, we reserve the right to cancel or refuse any orders placed at the incorrect price.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Orders and Payment</h2>
            <p>
              By placing an order, you offer to purchase a product subject to these terms. We reserve the
              right to accept or decline any order. All payments are securely processed. We currently accept
              credit cards, debit cards, and UPI payments. Orders are confirmed once payment is successfully
              processed.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Shipping and Delivery</h2>
            <p>
              We aim to dispatch all orders within 2-3 business days. Delivery timelines range from 5-7
              business days for standard shipping and 2-3 days for express shipping. We are not responsible
              for delays caused by courier partners, customs, or force majeure events.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Returns and Refunds</h2>
            <p>
              We accept returns within 7 days of delivery if the product is unused, in its original packaging,
              and accompanied by proof of purchase. Skincare products that have been opened cannot be returned
              due to hygiene reasons, unless the product is defective or damaged upon arrival. Refunds are
              processed within 5-7 business days.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>
              All content on the Velora website, including but not limited to text, graphics, logos, images,
              and software, is the exclusive property of Velora and is protected by applicable copyright and
              trademark laws. Reproduction, distribution, or use of any content without prior written permission
              is strictly prohibited.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              Velora shall not be liable for any indirect, incidental, special, or consequential damages
              arising from the use of our products or services. Our maximum liability is limited to the
              amount paid for the specific product in question.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please <Link to="/contact">contact us</Link> or
              email us at <strong>legal@velora.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
