import type { ElementType, Ref } from 'react';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface FormOwnProps {
  className?: string;
  cssModule?: CSSModule;
  innerRef?: Ref<any>;
}

export type FormProps<T extends ElementType = 'form'> = FormOwnProps &
  PolymorphicExtras<FormOwnProps, T>;

function Form<T extends ElementType = 'form'>({
  className,
  cssModule,
  tag,
  innerRef,
  ref,
  ...attributes
}: FormProps<T>) {
  const Tag: ElementType = tag ?? 'form';
  return (
    <Tag
      {...attributes}
      ref={innerRef ?? ref}
      className={mapToCssModules(className, cssModule)}
    />
  );
}

export default Form;
