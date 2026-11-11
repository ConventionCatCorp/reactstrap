import type { ElementType, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import { Transition, useNodeRef, type TransitionProps } from './Transition';
import {
  mapToCssModules,
  omit,
  pick,
  TransitionPropTypeKeys,
  TransitionTimeouts,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface FadeOwnProps extends TransitionProps {
  children?: ReactNode;
  baseClass?: string;
  baseClassActive?: string;
  className?: string;
  cssModule?: CSSModule;
  innerRef?: Ref<HTMLElement>;
}

export type FadeProps<T extends ElementType = 'div'> = FadeOwnProps &
  PolymorphicExtras<FadeOwnProps, T>;

function Fade<T extends ElementType = 'div'>({
  tag,
  baseClass = 'fade',
  baseClassActive = 'show',
  className,
  cssModule,
  children,
  innerRef,
  ref: refProp,
  timeout = TransitionTimeouts.Fade,
  appear = true,
  enter = true,
  exit = true,
  in: isIn = true,
  ...otherProps
}: FadeProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const [nodeRef, ref] = useNodeRef(
    innerRef ?? (refProp as Ref<HTMLElement> | undefined),
  );

  const transitionProps = {
    ...pick(otherProps as TransitionProps, TransitionPropTypeKeys),
    timeout,
    appear,
    enter,
    exit,
    in: isIn,
  };
  const childProps = omit(otherProps, TransitionPropTypeKeys);

  return (
    <Transition nodeRef={nodeRef} {...transitionProps}>
      {(status) => {
        const classes = mapToCssModules(
          classNames(
            className,
            baseClass,
            status === 'entered' && baseClassActive,
          ),
          cssModule,
        );
        return (
          <Tag className={classes} {...childProps} ref={ref}>
            {children}
          </Tag>
        );
      }}
    </Transition>
  );
}

export default Fade;
