import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ModalFooterOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type ModalFooterProps<T extends ElementType = 'div'> =
  ModalFooterOwnProps & PolymorphicExtras<ModalFooterOwnProps, T>;

function ModalFooter<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: ModalFooterProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'modal-footer'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default ModalFooter;
