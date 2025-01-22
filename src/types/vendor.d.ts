declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  // Common icons that were missing
  export const AlertTriangle: FC<IconProps>;
  export const Bell: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Phone: FC<IconProps>;
  export const Shield: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const MessageSquare: FC<IconProps>;
  export const MapPin: FC<IconProps>;
  export const AirVent: FC<IconProps>;
  export const Users: FC<IconProps>;
  export const Send: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const Tool: FC<IconProps>;
  export const Wind: FC<IconProps>;
  export const Droplet: FC<IconProps>;
  export const ThumbsUp: FC<IconProps>;
  export const Timer: FC<IconProps>;
  export const Gift: FC<IconProps>;
  export const Building: FC<IconProps>;
  export const HomeIcon: FC<IconProps>;
  export const StarIcon: FC<IconProps>;
  export const BuildingIcon: FC<IconProps>;
  export const Award: FC<IconProps>;
  export const LayoutGrid: FC<IconProps>;
  export const MapPinned: FC<IconProps>;
  export const ArrowUpCircle: FC<IconProps>;
  export const AtSign: FC<IconProps>;
  export const Eye: FC<IconProps>;
  export const Palette: FC<IconProps>;
  export const Tag: FC<IconProps>;
  export const History: FC<IconProps>;
  export const Monitor: FC<IconProps>;
  export const Smartphone: FC<IconProps>;
  export const Facebook: FC<IconProps>;
  export const Instagram: FC<IconProps>;
  export const Youtube: FC<IconProps>;
  export const Key: FC<IconProps>;
  export const Sliders: FC<IconProps>;
  export const Book: FC<IconProps>;
  export const Zap: FC<IconProps>;
  export const ShieldCheck: FC<IconProps>;
  export const BadgeCheck: FC<IconProps>;
  export const TrendingUp: FC<IconProps>;
  export const BarChart3: FC<IconProps>;
  export const LayoutDashboard: FC<IconProps>;
  export const Database: FC<IconProps>;
  export const Volume2: FC<IconProps>;
  export const Droplets: FC<IconProps>;
  export const HelpCircle: FC<IconProps>;
  export const RefreshCw: FC<IconProps>;
  export const CheckCircle2: FC<IconProps>;
}

declare module 'framer-motion' {
  import { ComponentType, PropsWithChildren } from 'react';

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    whileHover?: any;
    whileTap?: any;
    layout?: boolean;
    layoutId?: string;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    onClick?: () => void;
    className?: string;
    style?: any;
  }

  export interface AnimatePresenceProps {
    children: React.ReactNode;
    mode?: 'sync' | 'wait' | 'popLayout';
    initial?: boolean;
    onExitComplete?: () => void;
  }

  export const motion: {
    div: ComponentType<PropsWithChildren<MotionProps>>;
    button: ComponentType<PropsWithChildren<MotionProps>>;
    a: ComponentType<PropsWithChildren<MotionProps>>;
    svg: ComponentType<PropsWithChildren<MotionProps>>;
    path: ComponentType<PropsWithChildren<MotionProps>>;
  };

  export const AnimatePresence: ComponentType<AnimatePresenceProps>;
}

declare module 'react-countup' {
  import { FC } from 'react';

  interface CountUpProps {
    start?: number;
    end: number;
    duration?: number;
    decimals?: number;
    useEasing?: boolean;
    separator?: string;
    prefix?: string;
    suffix?: string;
  }

  const CountUp: FC<CountUpProps>;
  export default CountUp;
}