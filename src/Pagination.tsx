import type { ComponentPropsWithRef, ElementType } from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

export interface PaginationOwnProps {
  /** Add custom class */
  className?: string;
  /** Add custom class for list */
  listClassName?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Make the Pagination bigger or smaller (`pagination-${size}`) */
  size?: string;
  /** Set a custom element for this component */
  tag?: ElementType;
  'aria-label'?: string;
}

/**
 * Props other than the own ones go to the list element (`listTag`, default `ul`), not the outer `nav`,
 * so they are typed against `listTag`.
 */
export type PaginationProps<L extends ElementType = 'ul'> =
  PaginationOwnProps & {
    /** Set a custom element for list component */
    listTag?: L;
  } & Omit<ComponentPropsWithRef<L>, keyof PaginationOwnProps | 'listTag'>;

function Pagination<L extends ElementType = 'ul'>({
  className,
  listClassName,
  cssModule,
  size,
  tag: Tag = 'nav',
  listTag,
  'aria-label': label = 'pagination',
  ...attributes
}: PaginationProps<L>) {
  const ListTag: ElementType = listTag ?? 'ul';
  const classes = mapToCssModules(classNames(className), cssModule);
  const listClasses = mapToCssModules(
    classNames(listClassName, 'pagination', size && `pagination-${size}`),
    cssModule,
  );

  return (
    <Tag className={classes} aria-label={label}>
      <ListTag {...attributes} className={listClasses} />
    </Tag>
  );
}

export default Pagination;
