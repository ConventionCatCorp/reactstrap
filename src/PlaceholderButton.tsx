import type { ComponentPropsWithRef, ElementType } from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';
import Button, { type ButtonProps } from './Button';
import { getColumnClasses, type ColumnSizeProps } from './Col';

export interface PlaceholderButtonOwnProps extends Omit<
  ColumnSizeProps,
  'widths'
> {
  className?: string;
  cssModule?: CSSModule;
}

/**
 * Like `PolymorphicProps`, but `ComponentPropsWithRef<typeof Button>` erases to `any`
 * (Button is generic), so the default tag resolves to `ButtonProps` explicitly.
 */
export type PlaceholderButtonProps<T extends ElementType = typeof Button> =
  PlaceholderButtonOwnProps & {
    /** Element or component to render. */
    tag?: T;
  } & Omit<
      T extends typeof Button ? ButtonProps : ComponentPropsWithRef<T>,
      keyof PlaceholderButtonOwnProps | 'tag'
    >;

function PlaceholderButton<T extends ElementType = typeof Button>({
  cssModule,
  className,
  tag,
  ...attributes
}: PlaceholderButtonProps<T>) {
  const { modifiedAttributes, colClasses } = getColumnClasses(
    { color: 'primary', ...attributes },
    cssModule,
  );

  const classes = mapToCssModules(
    classNames('placeholder', className, colClasses),
    cssModule,
  );
  const Tag: ElementType = tag ?? Button;

  return <Tag {...modifiedAttributes} className={classes} disabled />;
}

export default PlaceholderButton;
