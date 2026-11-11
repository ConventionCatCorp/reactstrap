import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ModalBodyOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
}

export type ModalBodyProps<T extends ElementType = 'div'> = ModalBodyOwnProps &
  PolymorphicExtras<ModalBodyOwnProps, T>;

function ModalBody<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: ModalBodyProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const classes = mapToCssModules(
    classNames(className, 'modal-body'),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default ModalBody;
