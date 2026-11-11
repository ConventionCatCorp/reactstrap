import type {
  ElementType,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  warnOnce,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export type InputType =
  | 'text'
  | 'email'
  | 'select'
  | 'file'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'textarea'
  | 'button'
  | 'reset'
  | 'submit'
  | 'date'
  | 'datetime-local'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'range'
  | 'search'
  | 'tel'
  | 'url'
  | 'week'
  | 'password'
  | 'datetime'
  | 'time'
  | 'color';

export interface InputOwnProps {
  className?: string;
  children?: ReactNode;
  /** Bootstrap sizing (`form-control-*` / `form-select-*`) */
  bsSize?: 'lg' | 'sm';
  /** Adds `.is-valid` */
  valid?: boolean;
  /** Adds `.is-invalid` and `aria-invalid` */
  invalid?: boolean;
  innerRef?: Ref<any>;
  /** Render as read-only plain text (`.form-control-plaintext`) */
  plaintext?: boolean;
  /** Checkbox/radio inside an input group: omit `.form-check-input` */
  addon?: boolean;
  cssModule?: CSSModule;
}

/** Element rendered for a given `type` when no `tag` is set. */
export type InputElement<K extends InputType> = K extends 'textarea'
  ? 'textarea'
  : K extends 'select'
    ? 'select'
    : 'input';

type ElementOf<K extends InputType> = K extends 'textarea'
  ? HTMLTextAreaElement
  : K extends 'select'
    ? HTMLSelectElement
    : HTMLInputElement;

/** Attributes when `type` isn't one literal (e.g. `isLong ? 'textarea' : 'text'`): all, typed on the element union. */
type MixedControlAttributes<E extends HTMLElement> = InputHTMLAttributes<E> &
  TextareaHTMLAttributes<E> &
  SelectHTMLAttributes<E> & { ref?: Ref<E> };

type IsUnion<T, U = T> = T extends unknown
  ? [U] extends [T]
    ? false
    : true
  : never;

type InputTypeProps<K extends InputType> = InputOwnProps & {
  /** Input type; `select`/`textarea` render those elements, `switch` renders a checkbox */
  type?: K;
};

/**
 * HTML attributes follow the rendered element: `type="textarea"` → `<textarea>` props,
 * `type="select"` → `<select>` props (and `onChange` events), otherwise `<input>`; `tag` overrides.
 * A non-literal `type` gets the attributes of every element it may render.
 */
export type InputProps<
  K extends InputType = 'text',
  T extends ElementType = InputElement<K>,
> = InputTypeProps<K> &
  (true extends IsUnion<InputElement<K>>
    ? { tag?: ElementType } & Omit<
        MixedControlAttributes<ElementOf<K>>,
        keyof InputTypeProps<K> | 'tag'
      >
    : PolymorphicExtras<InputTypeProps<K>, T>);

function Input<
  K extends InputType = 'text',
  T extends ElementType = InputElement<K>,
>({
  className,
  cssModule,
  type = 'text' as K,
  bsSize,
  valid,
  invalid,
  tag,
  addon,
  plaintext,
  innerRef,
  ref,
  children,
  ...attributes
}: InputProps<K, T>) {
  const selectInput = type === 'select';
  let Tag: ElementType =
    tag ?? (selectInput || type === 'textarea' ? type : 'input');
  let formControlClass: string | false = 'form-control';

  if (plaintext) {
    formControlClass = 'form-control-plaintext';
    Tag = tag ?? 'input';
  } else if (type === 'range') {
    formControlClass = 'form-range';
  } else if (selectInput) {
    formControlClass = 'form-select';
  } else if (type === 'switch' || type === 'radio' || type === 'checkbox') {
    formControlClass = !addon && 'form-check-input';
  }

  const classes = mapToCssModules(
    classNames(
      className,
      invalid && 'is-invalid',
      valid && 'is-valid',
      bsSize &&
        (selectInput ? `form-select-${bsSize}` : `form-control-${bsSize}`),
      formControlClass,
    ),
    cssModule,
  );

  if (
    children &&
    !(plaintext || selectInput || typeof Tag !== 'string' || Tag === 'select')
  ) {
    warnOnce(
      `Input with a type of "${type}" cannot have children. Please use "value"/"defaultValue" instead.`,
    );
    children = undefined;
  }

  return (
    <Tag
      {...attributes}
      type={
        Tag === 'input' || typeof tag === 'function'
          ? type === 'switch'
            ? 'checkbox'
            : type
          : undefined
      }
      ref={innerRef ?? ref}
      className={classes}
      aria-invalid={invalid}
    >
      {children}
    </Tag>
  );
}

export default Input;
