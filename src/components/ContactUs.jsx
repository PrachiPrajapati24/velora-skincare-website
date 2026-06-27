import React, { useState } from 'react';
import api from '../utils/api';
import './ContactUs.css';
import { FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi';

const ContactUs = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await api.post('/contact', contactForm);
      if (res.data.success) {
        setShowSuccessMessage(true);
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        
        // Hide success message after 4 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Failed to submit contact request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Our team is here to help.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main">
        <div className="contact-container">
          {/* Contact Info Cards */}
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FiMail />
              </div>
              <h3>Email Us</h3>
              <p>support@velora.com</p>
              <p>info@velora.com</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FiPhone />
              </div>
              <h3>Call Us</h3>
              <p>+91 98765 43210</p>
              <p>Mon-Fri, 9AM-6PM IST</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FiMapPin />
              </div>
              <h3>Visit Us</h3>
              <p>123 Skincare Avenue</p>
              <p>Mumbai, India 400001</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FiClock />
              </div>
              <h3>Business Hours</h3>
              <p>Monday - Friday</p>
              <p>9:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-section">
            <div className="contact-form-content">
              <div className="contact-form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="contact-success-message">
                  <FiCheckCircle />
                  <div>
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="contact-error-message">
                  <p>{errorMessage}</p>
                </div>
              )}

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label>Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="contact-form-group">
                    <label>Subject*</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="How can we help?"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label>Your Message*</label>
                  <textarea
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="6"
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map">
        <iframe
          title="Velora Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.71637344413683!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890123"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default ContactUs;
