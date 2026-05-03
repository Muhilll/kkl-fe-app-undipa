import { Component, Show } from "solid-js";

export interface ToastState {
  type: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

const Toast: Component<ToastProps> = (props) => {
  return (
    <Show when={props.toast}>
      <div class={`app-toast app-toast-${props.toast!.type}`}>
        <span>{props.toast!.message}</span>
        <button type="button" class="app-toast-close" onClick={props.onClose}>
          x
        </button>
      </div>
    </Show>
  );
};

export default Toast;
