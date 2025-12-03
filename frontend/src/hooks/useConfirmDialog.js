/**
 * useConfirmDialog Hook
 * Reusable confirmation dialog state management
 * Eliminates duplicate confirm dialog patterns across 5+ pages
 */

import { useState, useCallback } from 'react';

/**
 * @returns {{
 *   confirmDialog: { open: boolean, title: string, description: string, onConfirm: Function, variant?: string },
 *   showConfirm: (title: string, description: string, onConfirm: Function, variant?: string) => void,
 *   closeConfirm: () => void
 * }}
 */
export const useConfirmDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'default' // 'default' | 'destructive'
  });

  const showConfirm = useCallback((title, description, onConfirm, variant = 'default') => {
    setConfirmDialog({ open: true, title, description, onConfirm, variant });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog({
      open: false,
      title: '',
      description: '',
      onConfirm: () => {},
      variant: 'default'
    });
  }, []);

  return {
    confirmDialog,
    showConfirm,
    closeConfirm
  };
};

export default useConfirmDialog;
