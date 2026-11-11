import {
  useContext,
  type ElementType,
  type MouseEvent,
  type MouseEventHandler,
} from 'react';
import classNames from 'classnames';
import { DropdownContext } from './DropdownContext';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface DropdownItemOwnProps {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  /** Render as `.dropdown-divider`. */
  divider?: boolean;
  /** Render as `h6.dropdown-header`. */
  header?: boolean;
  cssModule?: CSSModule;
  /** Renders an `a` when the tag is the default. */
  href?: string;
  onClick?: MouseEventHandler<any>;
  /** Close the dropdown on click. @default true */
  toggle?: boolean;
  /** Render as `span.dropdown-item-text`. */
  text?: boolean;
}

/** Extra props are typed by `tag` (default `button`; `h6`/`div`/`a`/`span` per `header`/`divider`/`href`/`text`). */
export type DropdownItemProps<T extends ElementType = 'button'> =
  DropdownItemOwnProps & PolymorphicExtras<DropdownItemOwnProps, T>;

function DropdownItem<T extends ElementType = 'button'>({
  className,
  cssModule,
  divider,
  tag,
  header,
  active,
  text,
  toggle,
  onClick,
  ...props
}: DropdownItemProps<T>) {
  const context = useContext(DropdownContext);
  const inert = props.disabled || header || divider || text;
  const tabIndex = inert ? '-1' : '0';
  const role = inert
    ? undefined
    : context.menuRole === 'listbox'
      ? 'option'
      : 'menuitem';

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (inert) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    if (toggle ?? true) context.toggle(e);
  };

  const classes = mapToCssModules(
    classNames(className, {
      disabled: props.disabled,
      'dropdown-item': !divider && !header && !text,
      active,
      'dropdown-header': header,
      'dropdown-divider': divider,
      'dropdown-item-text': text,
    }),
    cssModule,
  );

  let Tag: ElementType = tag ?? 'button';
  if (Tag === 'button') {
    if (header) Tag = 'h6';
    else if (divider) Tag = 'div';
    else if (props.href) Tag = 'a';
    else if (text) Tag = 'span';
  }

  return (
    <Tag
      type={Tag === 'button' && (onClick || toggle) ? 'button' : undefined}
      {...props}
      tabIndex={tabIndex}
      role={role}
      className={classes}
      onClick={handleClick}
    />
  );
}

export default DropdownItem;
