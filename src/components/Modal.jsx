import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import "../index.css";

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, // Ensure the modal is above other content
};

const modalStyle = {
  backgroundColor: "#242424",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid white",
  boxShadow: "0 2px 10px #000000",
  maxWidth: "500px",
  width: "100%",
  textAlign: "center",
};

const deleteButtonStyle = {
  backgroundColor: "red",
  color: "white",
  marginRight: "10px",
};

const Modal = ({ isOpen, onClose, onConfirm }) => {
  const deleteButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && deleteButtonRef.current) {
      deleteButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>Are you sure you want to delete the list?</h2>
        <p>This action is irreversible.</p>
        <button
          style={deleteButtonStyle}
          onClick={onConfirm}
          ref={deleteButtonRef}
        >
          Yes, delete
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Modal;
