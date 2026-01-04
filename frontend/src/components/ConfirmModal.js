/**
 * @file ConfirmModal.js - Reusable confirmation modal component
 * 
 * @description A Bootstrap-styled modal for confirmation dialogs.
 * Replaces the native window.confirm with a better UX.
 */

import React, { useEffect, useRef } from 'react';

/**
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - Button variant: "danger", "warning", "primary" (default: "danger")
 * @param {function} onConfirm - Callback when confirmed
 * @param {function} onCancel - Callback when cancelled
 * @param {boolean} loading - Show loading state on confirm button
 */
function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}) {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      setTimeout(() => confirmButtonRef.current?.focus(), 100);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, loading, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current && !loading) {
      onCancel();
    }
  };

  const variantClass = {
    danger: 'btn-danger',
    warning: 'btn-warning',
    primary: 'btn-primary',
  }[variant] || 'btn-danger';

  return (
    <div
      ref={modalRef}
      className="modal-backdrop-custom"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog-custom" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-content-custom">
          <div className="modal-header-custom">
            <h5 id="modal-title" className="modal-title-custom">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={loading}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body-custom">
            <p>{message}</p>
          </div>
          
          <div className="modal-footer-custom">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              type="button"
              className={`btn ${variantClass}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
