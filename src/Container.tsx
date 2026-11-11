import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ContainerOwnProps {
  /** `true` for `.container-fluid`, or a breakpoint (e.g. `md`) for `.container-md` */
  fluid?: boolean | string;
  className?: string;
  cssModule?: CSSModule;
}

export type ContainerProps<T extends ElementType = 'div'> = ContainerOwnProps &
  PolymorphicExtras<ContainerOwnProps, T>;

function Container<T extends ElementType = 'div'>({
  className,
  cssModule,
  fluid,
  tag,
  ...attributes
}: ContainerProps<T>) {
  let containerClass = 'container';
  if (fluid === true) {
    containerClass = 'container-fluid';
  } else if (fluid) {
    containerClass = `container-${fluid}`;
  }

  const classes = mapToCssModules(
    classNames(className, containerClass),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'div';

  return <Tag {...attributes} className={classes} />;
}

export default Container;
