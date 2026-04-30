export default function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Delete Flashcard?</h3>
        <p>Are you sure you want to delete this flashcard?</p>
        <p>This action cannot be undone.</p>

        <div style={styles.actions}>
          <button style={styles.deleteButton} onClick={onConfirm}>
            Delete
          </button>
          <button style={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#020617",
    padding: "20px",
    borderRadius: "12px",
    color: "white",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },
  deleteButton: {
    flex: 1,
    background: "#ff4d4d",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  cancelButton: {
    flex: 1,
    background: "#00f5ff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
