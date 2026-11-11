import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface FormTextOwnProps {
  className?: string;
  /** Omit the `.form-text` class */
  inline?: boolean;
  /** Text color (`text-${color}`); empty string for none */
  color?: string;
  cssModule?: CSSModule;
}

export type FormTextProps<T extends ElementType = 'small'> = FormTextOwnProps &
  PolymorphicExtras<FormTextOwnProps, T>;

function FormText<T extends ElementType = 'small'>({
  className,
  cssModule,
  inline,
  color = 'muted',
  tag,
  ...attributes
}: FormTextProps<T>) {
  const Tag: ElementType = tag ?? 'small';
  const classes = mapToCssModules(
    classNames(className, !inline && 'form-text', color && `text-${color}`),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default FormText;
