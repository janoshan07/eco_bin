import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [customEmail, setCustomEmail] = useState('');
  const [showInput, setShowInput] = useState(false);

  const mockAccounts = [
    { name: 'Janos Han', email: 'janoshan07@example.com', avatar: 'JH' },
    { name: 'Eco Tester', email: 'ecotest@example.com', avatar: 'ET' },
    { name: 'Sarah Green', email: 'sarah.g@example.com', avatar: 'SG' },
  ];

  const handleSelectAccount = (acc) => {
    onSuccess(acc.email, acc.name);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customEmail && customEmail.includes('@')) {
      const name = customEmail.split('@')[0].replace('.', ' ');
      onSuccess(customEmail, name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="google-modal-overlay">
          <motion.div
            className="google-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="google-modal-container"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <button className="google-modal-close" onClick={onClose} aria-label="Close dialog">
              &times;
            </button>

            <div className="google-brand-header">
              <svg className="google-svg" viewBox="0 0 24 24" width="28" height="28">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <h3>Sign in with Google</h3>
              <p>to continue to EcoBin Workspace</p>
            </div>

            {!showInput ? (
              <div className="google-accounts-list">
                {mockAccounts.map((acc, index) => (
                  <motion.button
                    key={index}
                    className="google-account-item"
                    onClick={() => handleSelectAccount(acc)}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="google-avatar">{acc.avatar}</div>
                    <div className="google-account-details">
                      <span className="google-account-name">{acc.name}</span>
                      <span className="google-account-email">{acc.email}</span>
                    </div>
                  </motion.button>
                ))}

                <motion.button
                  className="google-account-item google-use-another"
                  onClick={() => setShowInput(true)}
                  whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                >
                  <div className="google-avatar google-plus-avatar">+</div>
                  <div className="google-account-details">
                    <span className="google-account-name">Use another account</span>
                  </div>
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="google-custom-form">
                <div className="google-input-group">
                  <label htmlFor="google-email">Email or phone</label>
                  <input
                    type="email"
                    id="google-email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoFocus
                  />
                </div>
                <div className="google-form-actions">
                  <button
                    type="button"
                    className="google-btn-secondary"
                    onClick={() => setShowInput(false)}
                  >
                    Back
                  </button>
                  <button type="submit" className="google-btn-primary">
                    Next
                  </button>
                </div>
              </form>
            )}

            <div className="google-modal-footer">
              To continue, Google will share your name, email address, language preference, and profile
              picture with EcoBin. See our Privacy Policy and Terms of Service.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoogleAuthModal;
