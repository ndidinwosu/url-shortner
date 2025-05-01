import { useState } from 'react';

interface ErrorPopupHook {
  isOpen: boolean;
  error: string | null;
  showError: (errorMessage: string) => void;
  hideError: () => void;
}

export const useErrorPopup = (): ErrorPopupHook => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showError = (errorMessage: string) => {
    setError(errorMessage);
    setIsOpen(true);
  };

  const hideError = () => {
    setIsOpen(false);
    // 在動畫完成後再清除錯誤訊息
    setTimeout(() => setError(null), 300);
  };

  return {
    isOpen,
    error,
    showError,
    hideError
  };
};