import type { CSSProperties, ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ProgressOwnProps {
  /** Enable animation to bar */
  animated?: boolean;
  /** Render only the bar (use inside a `multi` Progress) */
  bar?: boolean;
  barAriaLabelledBy?: string;
  barAriaValueText?: string;
  barClassName?: string;
  barStyle?: CSSProperties;
  children?: ReactNode;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Add custom color to the progress bar */
  color?: string;
  /** Maximum value of progress */
  max?: string | number;
  /** Minimum value of progress, defaults to zero */
  min?: string | number;
  /** Render children (bars) instead of a single bar */
  multi?: boolean;
  /** Add stripes to progress bar */
  striped?: boolean;
  style?: CSSProperties;
  /** Current value of progress */
  value?: string | number;
}

export type ProgressProps<T extends ElementType = 'div'> = ProgressOwnProps &
  PolymorphicExtras<ProgressOwnProps, T>;

function Progress<T extends ElementType = 'div'>({
  children,
  className,
  barClassName,
  cssModule,
  value = 0,
  min = 0,
  max = 100,
  animated,
  striped,
  color,
  bar,
  multi,
  tag,
  style = {},
  barStyle = {},
  barAriaValueText,
  barAriaLabelledBy,
  ...attributes
}: ProgressProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const percent = (Number(value) / Number(max)) * 100;

  const progressClasses = mapToCssModules(
    classNames(className, 'progress'),
    cssModule,
  );

  const progressBarClasses = mapToCssModules(
    classNames(
      'progress-bar',
      bar ? className || barClassName : barClassName,
      animated && 'progress-bar-animated',
      color && `bg-${color}`,
      (striped || animated) && 'progress-bar-striped',
    ),
    cssModule,
  );

  // aria-value* accept strings at runtime; React's types only allow numbers.
  const progressBarProps: Record<string, unknown> = {
    className: progressBarClasses,
    style: {
      ...(bar ? style : {}),
      ...barStyle,
      width: `${percent}%`,
    },
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuetext': barAriaValueText,
    'aria-labelledby': barAriaLabelledBy,
    children,
  };

  if (bar) {
    return <Tag {...attributes} {...progressBarProps} />;
  }

  return (
    <Tag {...attributes} style={style} className={progressClasses}>
      {multi ? children : <div {...progressBarProps} />}
    </Tag>
  );
}

export default Progress;
