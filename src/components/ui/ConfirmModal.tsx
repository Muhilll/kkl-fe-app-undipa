import { Component } from "solid-js";
import Modal from "./Modal";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: Component<ConfirmModalProps> = (props) => {
  return (
    <Modal open={props.open} onClose={props.onCancel} cardClass="modal-card-confirm">
      <div class="form-section">
        <div class="form-section-header">
          <h2>{props.title}</h2>
        </div>

        <p class="confirm-message">{props.message}</p>

        <div class="confirm-actions">
          <button type="button" class="btn-secondary" onClick={props.onCancel}>
            {props.cancelLabel || "Cancel"}
          </button>
          <button
            type="button"
            class="btn-danger"
            onClick={props.onConfirm}
            disabled={props.confirmLoading}
          >
            {props.confirmLoading
              ? "Processing..."
              : props.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
