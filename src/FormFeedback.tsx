import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface FormFeedbackOwnProps {
  className?: string;
  cssModule?: CSSModule;
  /** Render as `valid-*` instead of `invalid-*` */
  valid?: boolean;
  /** Render as a tooltip instead of block feedback */
  tooltip?: boolean;
}

export type FormFeedbackProps<T extends ElementType = 'div'> =
  FormFeedbackOwnProps & PolymorphicExtras<FormFeedbackOwnProps, T>;

function FormFeedback<T extends ElementType = 'div'>({
  className,
  cssModule,
  valid,
  tooltip,
  tag,
  ...attributes
}: FormFeedbackProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const validMode = tooltip ? 'tooltip' : 'feedback';
  const classes = mapToCssModules(
    classNames(
      className,
      valid ? `valid-${validMode}` : `invalid-${validMode}`,
    ),
    cssModule,
  );

  return <Tag {...attributes} className={classes} />;
}

export default FormFeedback;
