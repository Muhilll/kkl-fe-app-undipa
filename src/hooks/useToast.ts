import { createSignal } from "solid-js";
import type { ToastState } from "../components/ui/Toast";

export const useToast = (duration = 3000) => {
  const [toast, setToast] = createSignal<ToastState | null>(null);
  let timeoutId: number | undefined;

  const clearToast = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    setToast(null);
  };

  const showToast = (type: ToastState["type"], message: string) => {
    clearToast();
    setToast({ type, message });
    timeoutId = window.setTimeout(() => {
      setToast(null);
      timeoutId = undefined;
    }, duration);
  };

  return {
    toast,
    showToast,
    clearToast,
  };
};
