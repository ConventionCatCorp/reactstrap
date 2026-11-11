import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface PopoverBodyOwnProps {
  className?: string;
  cssModule?: CSSModule;
}

export type PopoverBodyProps<T extends ElementType = 'div'> =
  PopoverBodyOwnProps & PolymorphicExtras<PopoverBodyOwnProps, T>;

function PopoverBody<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  ...attributes
}: PopoverBodyProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  return (
    <Tag
      {...attributes}
      className={mapToCssModules(
        classNames(className, 'popover-body'),
        cssModule,
      )}
    />
  );
}

export default PopoverBody;
