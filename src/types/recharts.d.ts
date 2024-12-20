declare module 'recharts' {
  import * as React from 'react';

  /**
   * Base chart props interface
   */
  export interface BaseChartProps {
    /**
     * Chart data
     */
    data?: any[];
    /**
     * Chart width
     */
    width?: number;
    /**
     * Chart height
     */
    height?: number;
    /**
     * Chart margins
     */
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    /**
     * Chart children
     */
    children?: React.ReactNode;
  }

  /**
   * Line chart props interface
   */
  export interface LineChartProps extends BaseChartProps {
    /**
     * Whether to sync chart animations
     */
    syncId?: string;
    /**
     * Whether to sync chart tooltips
     */
    syncMethod?: 'index' | 'value';
  }

  /**
   * Bar chart props interface
   */
  export interface BarChartProps extends BaseChartProps {
    /**
     * Whether bars are stacked
     */
    stackOffset?: 'sign' | 'expand' | 'none' | 'wiggle' | 'silhouette';
    /**
     * Bar gap percentage
     */
    barGap?: number;
    /**
     * Bar category gap percentage
     */
    barCategoryGap?: number;
  }

  /**
   * Axis props interface
   */
  export interface AxisProps {
    /**
     * Data key for the axis
     */
    dataKey?: string;
    /**
     * Axis type
     */
    type?: 'number' | 'category';
    /**
     * Whether to allow decimals
     */
    allowDecimals?: boolean;
    /**
     * Axis domain
     */
    domain?: [number | string, number | string];
    /**
     * Axis tick count
     */
    tickCount?: number;
    /**
     * Axis tick formatter
     */
    tickFormatter?: (value: any) => string;
    /**
     * Axis label
     */
    label?: string | number | React.ReactElement;
    /**
     * Axis children
     */
    children?: React.ReactNode;
  }

  /**
   * X-axis props interface
   */
  export interface XAxisProps extends AxisProps {
    /**
     * X-axis specific properties
     */
    angle?: number;
    /**
     * X-axis text anchor
     */
    textAnchor?: 'start' | 'middle' | 'end';
  }

  /**
   * Y-axis props interface
   */
  export interface YAxisProps extends AxisProps {
    /**
     * Y-axis orientation
     */
    orientation?: 'left' | 'right';
    /**
     * Y-axis width
     */
    width?: number;
  }

  /**
   * Cartesian grid props interface
   */
  export interface CartesianGridProps {
    /**
     * Grid stroke dash array
     */
    strokeDasharray?: string;
    /**
     * Grid horizontal lines
     */
    horizontal?: boolean;
    /**
     * Grid vertical lines
     */
    vertical?: boolean;
    /**
     * Grid children
     */
    children?: React.ReactNode;
  }

  /**
   * Tooltip props interface
   */
  export interface TooltipProps {
    /**
     * Tooltip content
     */
    content?: React.ReactElement | ((props: any) => React.ReactElement);
    /**
     * Tooltip cursor
     */
    cursor?: boolean | React.ReactElement | object;
    /**
     * Tooltip offset
     */
    offset?: number;
    /**
     * Tooltip position
     */
    position?: { x: number; y: number };
    /**
     * Tooltip children
     */
    children?: React.ReactNode;
  }

  /**
   * Legend props interface
   */
  export interface LegendProps {
    /**
     * Legend alignment
     */
    align?: 'left' | 'center' | 'right';
    /**
     * Legend vertical alignment
     */
    verticalAlign?: 'top' | 'middle' | 'bottom';
    /**
     * Legend layout
     */
    layout?: 'horizontal' | 'vertical';
    /**
     * Legend icon type
     */
    iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye';
    /**
     * Legend children
     */
    children?: React.ReactNode;
  }

  /**
   * Responsive container props interface
   */
  export interface ResponsiveContainerProps {
    /**
     * Container aspect ratio
     */
    aspect?: number;
    /**
     * Container width
     */
    width?: string | number;
    /**
     * Container height
     */
    height?: string | number;
    /**
     * Minimum width
     */
    minWidth?: number;
    /**
     * Minimum height
     */
    minHeight?: number;
    /**
     * Whether to debounce resize
     */
    debounce?: number;
    /**
     * Container children
     */
    children?: React.ReactNode;
  }

  /**
   * Line props interface
   */
  export interface LineProps {
    /**
     * Line type
     */
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    /**
     * Data key
     */
    dataKey: string;
    /**
     * Line stroke color
     */
    stroke?: string;
    /**
     * Line stroke width
     */
    strokeWidth?: number;
    /**
     * Active dot configuration
     */
    activeDot?: boolean | object | React.ReactElement;
    /**
     * Whether to connect nulls
     */
    connectNulls?: boolean;
    /**
     * Line children
     */
    children?: React.ReactNode;
  }

  /**
   * Bar props interface
   */
  export interface BarProps {
    /**
     * Data key
     */
    dataKey: string;
    /**
     * Bar fill color
     */
    fill?: string;
    /**
     * Bar stroke color
     */
    stroke?: string;
    /**
     * Bar radius
     */
    radius?: number | [number, number, number, number];
    /**
     * Bar children
     */
    children?: React.ReactNode;
  }

  // Component class declarations
  export class LineChart extends React.Component<LineChartProps> {}
  export class BarChart extends React.Component<BarChartProps> {}
  export class XAxis extends React.Component<XAxisProps> {}
  export class YAxis extends React.Component<YAxisProps> {}
  export class CartesianGrid extends React.Component<CartesianGridProps> {}
  export class Tooltip extends React.Component<TooltipProps> {}
  export class Legend extends React.Component<LegendProps> {}
  export class ResponsiveContainer extends React.Component<ResponsiveContainerProps> {}
  export class Line extends React.Component<LineProps> {}
  export class Bar extends React.Component<BarProps> {}
}