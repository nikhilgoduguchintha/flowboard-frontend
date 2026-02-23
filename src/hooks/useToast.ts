import toast from "react-hot-toast";
import type { ToastType } from "../types";

interface ToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
  id?: string;
}

export function useToast() {
  const show = ({ type, message, duration, id }: ToastOptions) => {
    const options = { duration, id };

    switch (type) {
      case "success":
        return toast.success(message, options);
      case "error":
        return toast.error(message, options);
      case "loading":
        return toast.loading(message, options);
      case "warning":
        return toast(message, { ...options, icon: "⚠️" });
      case "info":
        return toast(message, { ...options, icon: "ℹ️" });
    }
  };

  const success = (message: string, id?: string) =>
    show({ type: "success", message, id });

  const error = (message: string, id?: string) =>
    show({ type: "error", message, id });

  const info = (message: string, id?: string) =>
    show({ type: "info", message, id });

  const warning = (message: string, id?: string) =>
    show({ type: "warning", message, id });

  const loading = (message: string, id: string) =>
    show({ type: "loading", message, id });

  // Replace a loading toast with a result
  const update = (
    id: string,
    type: Exclude<ToastType, "loading">,
    message: string
  ) => {
    toast.dismiss(id);
    show({ type, message, id });
  };

  const dismiss = (id?: string) => toast.dismiss(id);

  return {
    show,
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss,
  };
}
