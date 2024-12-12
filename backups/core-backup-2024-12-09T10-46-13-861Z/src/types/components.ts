import { HTMLAttributes } from 'react';

export interface ComponentBaseProps extends HTMLAttributes<HTMLElement> {
    className?: string;
}

export interface ComponentProps extends ComponentBaseProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}
