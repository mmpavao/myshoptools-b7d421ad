import { useToast as useToastOriginal } from "@/components/ui/toast"
import CustomToast from './CustomToast';

export function useToast() {
  const originalToast = useToastOriginal();

  const customToast = {
    ...originalToast,
    custom: ({ variant, title, description }) => {
      originalToast.dismiss();
      originalToast.custom((props) => (
        <CustomToast
          variant={variant}
          title={title}
          description={description}
          onClose={() => props.dismiss()}
        />
      ));
    },
  };

  return customToast;
}

// Export the toast function directly
export const toast = useToast();

export { ToastProvider, ToastViewport } from "@/components/ui/toast"