import "react";
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
  backgroundColor: "white",
  color: "black",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "500px",
  width: "100%",
  textAlign: "center",
};

const deleteButton = {
  backgroundColor: "#c83434",
  color: "white",
};

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>Are you sure you want to delete the list?</h2>
        <p>This action is irreversible.</p>
        <button
          style={deleteButton}
          onClick={onConfirm}
        >
          Yes, delete
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
