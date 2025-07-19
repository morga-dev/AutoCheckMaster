import toast from "react-hot-toast";
import { useSettings } from "./ConfiguracionContexto";

export function UsoToast() {
  const { settings } = useSettings();
  return {
    success: (msg) => settings.notifications && toast.success(msg),
    error: (msg) => settings.notifications && toast.error(msg),
    promise: (promiseFunction, messages = {}) => {
      if (!settings.notifications) return promiseFunction;
      
      const defaultMessages = {
        loading: 'Procesando...',
        success: 'Operación completada exitosamente',
        error: 'Error al procesar la operación'
      };

      const finalMessages = { ...defaultMessages, ...messages };

      return toast.promise(promiseFunction, {
        loading: finalMessages.loading,
        success: finalMessages.success,
        error: (err) => {
          if (typeof finalMessages.error === 'function') {
            return finalMessages.error(err);
          }
          return finalMessages.error;
        }
      });
    }
  };
}