import React from 'react';
import { BaseProps } from './types';

interface DialogProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps extends BaseProps {}

interface DialogHeaderProps extends BaseProps {}

interface DialogFooterProps extends BaseProps {}

interface DialogTitleProps extends BaseProps {}

interface DialogDescriptionProps extends BaseProps {}

export const Dialog: React.FC<DialogProps> = ({ 
  children,
  className = '',
  open,
  onOpenChange
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

export const DialogFooter: React.FC<DialogFooterProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ 
  children,
  className = ''
}) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};
