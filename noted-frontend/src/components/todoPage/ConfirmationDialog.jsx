import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function ConfirmationDialog({ isOpen, onCancel, onConfirm }) {
  return (
    <Popup open={isOpen} onClose={onCancel} modal nested>
      {(close) => (
        <div className="confirmation-dialog-content">
          <p>Are you sure you want to delete it?</p>
          <div className="confirmation-dialog-buttons">
            <button
              type="button"
              className="no-button"
              onClick={() => {
                onCancel();
                close();
              }}
            >
              No
            </button>
            <button
              type="button"
              className="yes-button"
              onClick={() => {
                onConfirm();
                close();
              }}
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default ConfirmationDialog;
