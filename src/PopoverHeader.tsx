import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface PopoverHeaderOwnProps {
  className?: string;
  cssModule?: CSSModule;
}

export type PopoverHeaderProps<T extends ElementType = 'h3'> =
  PopoverHeaderOwnProps & PolymorphicExtras<PopoverHeaderOwnProps, T>;

function PopoverHeader<T extends ElementType = 'h3'>({
  className,
  cssModule,
  tag,
  ...attributes
}: PopoverHeaderProps<T>) {
  const Tag: ElementType = tag ?? 'h3';
  return (
    <Tag
      {...attributes}
      className={mapToCssModules(
        classNames(className, 'popover-header'),
        cssModule,
      )}
    />
  );
}

export default PopoverHeader;
