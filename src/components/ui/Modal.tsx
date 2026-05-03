import { Component, JSX, Show } from "solid-js";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
  cardClass?: string;
}

const Modal: Component<ModalProps> = (props) => {
  return (
    <Show when={props.open}>
      <div class="modal-overlay" onClick={props.onClose}>
        <div
          class={`modal-card${props.cardClass ? ` ${props.cardClass}` : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>
      </div>
    </Show>
  );
};

export default Modal;
