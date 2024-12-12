import { ComponentProps } from '@components/types';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/organisms/Dialog';
import { Button } from '@components/atoms/Button';
import { cn } from '../../utils/cn';

export interface AddressConfirmationModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  address: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

const AddressConfirmationModal = React.forwardRef<HTMLDivElement, AddressConfirmationModalProps>(
  ({
    className,
    isOpen,
    onClose,
    onConfirm,
    address,
    title = 'Confirm Address',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    ...props
  }, ref) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn('sm:max-w-[425px]', className)} {...props} ref={ref}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">
              Please confirm that this is the correct address:
            </p>
            <p className="text-sm font-medium">{address}</p>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <Button onClick={onConfirm}>
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
AddressConfirmationModal.displayName = 'AddressConfirmationModal';

export { AddressConfirmationModal };
