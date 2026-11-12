import {
  Component,
  type ContextType,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type Ref,
} from 'react';
import classNames from 'classnames';
import { DropdownContext } from './DropdownContext';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicClassExtras,
} from './utils';
import Button from './Button';

export interface DropdownToggleOwnProps {
  /** Render as `.dropdown-toggle` (with caret). */
  caret?: boolean;
  /** Button color, when rendered as the default `Button`. @default 'secondary' */
  color?: string;
  className?: string;
  cssModule?: CSSModule;
  disabled?: boolean;
  /** Forwarded to `Button`. */
  outline?: boolean;
  /** Forwarded to `Button`. */
  size?: string;
  /** @default true */
  'aria-haspopup'?: boolean;
  /** Render as `.dropdown-toggle-split`. */
  split?: boolean;
  /** Render as `a.nav-link`. */
  nav?: boolean;
  innerRef?: Ref<HTMLElement>;
  onClick?: MouseEventHandler<any>;
}

/** Default rendered component: `Button` (as a `button`), or `a` when `nav`. */
type DefaultTag = typeof Button<'button'>;

/** Extra props are typed by `tag` (default `Button`). */
export type DropdownToggleProps<T extends ElementType = DefaultTag> =
  DropdownToggleOwnProps & PolymorphicClassExtras<DropdownToggleOwnProps, T>;

type DropdownToggleImplProps = DropdownToggleOwnProps & {
  tag?: ElementType;
} & HTMLAttributes<HTMLElement>;

class DropdownToggle<T extends ElementType = DefaultTag> extends Component<
  DropdownToggleProps<T>
> {
  // Not `Readonly<P>`: lets JSX infer `T` from a string `tag` (else it widens to `ElementType`).
  declare props: DropdownToggleProps<T>;
  static override contextType = DropdownContext;
  declare context: ContextType<typeof DropdownContext>;

  onClick = (e: MouseEvent<HTMLElement>) => {
    if (this.props.disabled || this.context.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.nav && !this.props.tag) e.preventDefault();
    this.props.onClick?.(e);
    this.context.toggle(e);
  };

  // Stable, so React only calls it on mount/unmount.
  handleRef = (el: HTMLElement | null) => {
    const { innerRef } = this.props;
    if (typeof innerRef === 'function') innerRef(el);
    else if (innerRef) innerRef.current = el;
    this.context.onToggleRef?.(el);
  };

  getRole() {
    return this.context.menuRole || (this.props['aria-haspopup'] ?? true);
  }

  override render() {
    const {
      className,
      color = 'secondary',
      cssModule,
      caret,
      split,
      nav,
      tag,
      innerRef: _innerRef,
      ...props
    } = this.props as DropdownToggleImplProps;
    const ariaLabel = props['aria-label'] || 'Toggle Dropdown';
    const classes = mapToCssModules(
      classNames(className, {
        'dropdown-toggle': caret || split,
        'dropdown-toggle-split': split,
        'nav-link': nav,
      }),
      cssModule,
    );
    const children =
      props.children !== undefined ? (
        props.children
      ) : (
        <span className="visually-hidden">{ariaLabel}</span>
      );

    let Tag: ElementType;
    let extra = {};
    if (nav && !tag) {
      Tag = 'a';
      extra = { href: '#' };
    } else if (!tag) {
      Tag = Button;
      extra = { color, cssModule };
    } else {
      Tag = tag;
    }

    return (
      <Tag
        {...props}
        {...extra}
        {...{ [typeof Tag === 'string' ? 'ref' : 'innerRef']: this.handleRef }}
        className={classes}
        onClick={this.onClick}
        aria-expanded={this.context.isOpen}
        aria-haspopup={this.getRole()}
      >
        {children}
      </Tag>
    );
  }
}

export default DropdownToggle;
