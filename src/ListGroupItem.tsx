import type { ElementType, MouseEvent } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface ListGroupItemOwnProps {
  /** Add action prop to give effects while hovering over element */
  action?: boolean;
  /** Add active prop to make the current selection active */
  active?: boolean;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Add background colour to the list item */
  color?: string;
  /** Make the list item appear disabled (also swallows clicks) */
  disabled?: boolean;
  href?: string;
  onClick?: (e: MouseEvent<any>) => void;
}

export type ListGroupItemProps<T extends ElementType = 'li'> =
  ListGroupItemOwnProps & PolymorphicExtras<ListGroupItemOwnProps, T>;

const handleDisabledOnClick = (e: MouseEvent) => {
  e.preventDefault();
};

function ListGroupItem<T extends ElementType = 'li'>({
  className,
  cssModule,
  tag,
  active,
  disabled,
  action,
  color,
  onClick,
  ...attributes
}: ListGroupItemProps<T>) {
  const classes = mapToCssModules(
    classNames(
      className,
      active && 'active',
      disabled && 'disabled',
      action && 'list-group-item-action',
      color && `list-group-item-${color}`,
      'list-group-item',
    ),
    cssModule,
  );
  const Tag: ElementType = tag ?? 'li';

  return (
    <Tag
      {...attributes}
      onClick={disabled ? handleDisabledOnClick : onClick}
      className={classes}
    />
  );
}

export default ListGroupItem;
