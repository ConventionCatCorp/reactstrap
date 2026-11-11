import type { ElementType } from 'react';
import classNames from 'classnames';
import {
  mapToCssModules,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';
import Dropdown, { type DropdownProps } from './Dropdown';
import { InputGroupContext } from './InputGroupContext';

export interface InputGroupOwnProps {
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Sets size of InputGroup */
  size?: string;
  /** Only `'dropdown'` is meaningful (see `InputGroupDropdownProps`) */
  type?: undefined;
}

/** `type="dropdown"`: renders a `Dropdown`, which receives the remaining props. */
export type InputGroupDropdownProps = Omit<DropdownProps, 'type'> & {
  type: 'dropdown';
};

export type InputGroupProps<T extends ElementType = 'div'> =
  | (InputGroupOwnProps & PolymorphicExtras<InputGroupOwnProps, T>)
  | InputGroupDropdownProps;

const contextValue = { insideInputGroup: true };

function InputGroup<T extends ElementType = 'div'>({
  className,
  cssModule,
  tag,
  type,
  size,
  ...attributes
}: InputGroupProps<T>) {
  const classes = mapToCssModules(
    classNames(className, 'input-group', size && `input-group-${size}`),
    cssModule,
  );

  if (type === 'dropdown') {
    return <Dropdown {...(attributes as DropdownProps)} className={classes} />;
  }

  const Tag: ElementType = tag ?? 'div';
  return (
    <InputGroupContext.Provider value={contextValue}>
      <Tag {...attributes} className={classes} />
    </InputGroupContext.Provider>
  );
}

export default InputGroup;
