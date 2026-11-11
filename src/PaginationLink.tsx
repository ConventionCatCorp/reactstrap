import type { ElementType, ReactNode } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface PaginationLinkOwnProps {
  'aria-label'?: string;
  children?: ReactNode;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Without it, the default `a` renders as a `button` */
  href?: string;
  /** Add to next button to add default aria label and icon */
  next?: boolean;
  /** Add to previous button to add default aria label and icon */
  previous?: boolean;
  /** Add to first button to add default aria label and icon */
  first?: boolean;
  /** Add to last button to add default aria label and icon */
  last?: boolean;
}

/** Default `tag` is `a`, rendered as `button` when there is no `href`. */
export type PaginationLinkProps<T extends ElementType = 'a'> =
  PaginationLinkOwnProps & PolymorphicExtras<PaginationLinkOwnProps, T>;

const carets = {
  Previous: '‹',
  Next: '›',
  First: '«',
  Last: '»',
};

function PaginationLink<T extends ElementType = 'a'>({
  className,
  cssModule,
  next,
  previous,
  first,
  last,
  tag,
  href,
  children,
  'aria-label': ariaLabelProp,
  ...attributes
}: PaginationLinkProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'page-link'),
    cssModule,
  );
  const kind = previous
    ? 'Previous'
    : next
      ? 'Next'
      : first
        ? 'First'
        : last
          ? 'Last'
          : undefined;
  const ariaLabel = ariaLabelProp || kind;
  const Tag: ElementType =
    !href && (tag ?? 'a') === 'a' ? 'button' : (tag ?? 'a');

  if (Array.isArray(children) && children.length === 0) children = null;

  return (
    <Tag {...attributes} href={href} className={classes} aria-label={ariaLabel}>
      {kind ? (
        <>
          <span aria-hidden="true">{children || carets[kind]}</span>
          <span className="visually-hidden">{ariaLabel}</span>
        </>
      ) : (
        children
      )}
    </Tag>
  );
}

export default PaginationLink;
