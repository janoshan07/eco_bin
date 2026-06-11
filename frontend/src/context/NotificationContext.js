import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import '../components/styles/Notification.css';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

// Heuristic to classify simple text messages into appropriate toast types
const getNotificationType = (msg) => {
  const lower = msg.toLowerCase();
  if (lower.includes('success') || lower.includes('added') || lower.includes('updated') || lower.includes('deleted') || lower.includes('completed')) {
    return 'success';
  }
  if (lower.includes('fail') || lower.includes('error') || lower.includes('cannot') || lower.includes('invalid') || lower.includes('missing') || lower.includes('rejected')) {
    return 'error';
  }
  if (lower.includes('warning') || lower.includes('attention') || lower.includes('exceed')) {
    return 'warning';
  }
  return 'info';
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', resolve: null });

  // Core function to trigger a toast
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Core function to trigger a confirmation dialog modal
  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, message, resolve });
    });
  }, []);

  // Hook global window.alert to display beautiful toasts instead of native browser popups
  useEffect(() => {
    const originalAlert = window.alert;
    
    window.alert = (msg) => {
      if (typeof msg !== 'string') {
        try {
          msg = String(msg);
        } catch (e) {
          msg = 'Notification';
        }
      }
      const type = getNotificationType(msg);
      showToast(msg, type);
    };

    return () => {
      window.alert = originalAlert; // Restore on unmount if hot reloaded
    };
  }, [showToast]);

  // Create a callable function that has custom sub-methods
  const notify = useCallback((msg, type = 'info') => {
    showToast(msg, type);
  }, [showToast]);

  notify.success = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  notify.error = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  notify.warning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);
  notify.info = useCallback((msg) => showToast(msg, 'info'), [showToast]);
  notify.confirm = showConfirm;

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <i className="bx bx-check-circle"></i>}
              {toast.type === 'error' && <i className="bx bx-x-circle"></i>}
              {toast.type === 'warning' && <i className="bx bx-error"></i>}
              {toast.type === 'info' && <i className="bx bx-info-circle"></i>}
            </div>
            <div className="toast-content">
              <p>{toast.message}</p>
            </div>
            <button className="toast-close-btn" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
              <i className="bx bx-x"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog Overlay */}
      {confirmState.isOpen && (
        <div className="confirm-overlay">
          <div className="confirm-card">
            <div className="confirm-icon">
              <i className="bx bx-help-circle"></i>
            </div>
            <h3>Are you sure?</h3>
            <p>{confirmState.message}</p>
            <div className="confirm-actions">
              <button 
                className="confirm-btn confirm-cancel" 
                onClick={() => {
                  confirmState.resolve(false);
                  setConfirmState({ isOpen: false, message: '', resolve: null });
                }}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn confirm-ok" 
                onClick={() => {
                  confirmState.resolve(true);
                  setConfirmState({ isOpen: false, message: '', resolve: null });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
