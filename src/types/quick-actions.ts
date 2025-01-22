import type { IconProps } from 'lucide-react';

type LucideIcon = React.ComponentType<IconProps>;

/**
 * Quick action button props
 */
export interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  gradientFrom: string;
  iconColor: string;
}

/**
 * Quick actions props
 */
export interface QuickActionsProps {
  className?: string;
}