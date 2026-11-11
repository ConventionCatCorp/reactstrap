import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface FormGroupOwnProps {
  className?: string;
  /** Lay out as a grid row */
  row?: boolean;
  /** Wrap a checkbox/radio (`.form-check`) */
  check?: boolean;
  /** Wrap a switch (`.form-check.form-switch`) */
  switch?: boolean;
  /** Inline check/switch */
  inline?: boolean;
  /** Floating label wrapper (`.form-floating`) */
  floating?: boolean;
  /** Omit the default `mb-3` margin */
  noMargin?: boolean;
  /** Adds `.disabled` to check/switch groups; sets `disabled` on a `fieldset` tag */
  disabled?: boolean;
  cssModule?: CSSModule;
}

export type FormGroupProps<T extends ElementType = 'div'> = FormGroupOwnProps &
  PolymorphicExtras<FormGroupOwnProps, T>;

function FormGroup<T extends ElementType = 'div'>({
  className,
  cssModule,
  row,
  disabled,
  check,
  inline,
  floating,
  noMargin,
  tag,
  switch: switchProp,
  ...attributes
}: FormGroupProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const formCheck = check || switchProp;

  const classes = mapToCssModules(
    classNames(
      className,
      row && 'row',
      formCheck && 'form-check',
      switchProp && 'form-switch',
      !(formCheck || noMargin) && 'mb-3',
      formCheck && inline && 'form-check-inline',
      formCheck && disabled && 'disabled',
      floating && 'form-floating',
    ),
    cssModule,
  );

  return (
    <Tag
      {...attributes}
      disabled={Tag === 'fieldset' ? disabled : undefined}
      className={classes}
    />
  );
}

export default FormGroup;
