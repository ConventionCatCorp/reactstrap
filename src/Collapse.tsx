import { useState, type ElementType, type ReactNode, type Ref } from 'react';
import classNames from 'classnames';
import {
  Transition,
  useNodeRef,
  type TransitionProps,
  type TransitionStatus,
} from './Transition';
import {
  mapToCssModules,
  omit,
  pick,
  TransitionPropTypeKeys,
  TransitionTimeouts,
  type CSSModule,
  type PolymorphicExtras,
} from './utils';

export interface CollapseOwnProps extends Omit<TransitionProps, 'in'> {
  /** Make content animation appear horizontally */
  horizontal?: boolean;
  /** Set if Collapse is open or closed */
  isOpen?: boolean;
  children?: ReactNode;
  className?: string;
  navbar?: boolean;
  cssModule?: CSSModule;
  innerRef?: Ref<HTMLElement>;
}

export type CollapseProps<T extends ElementType = 'div'> = CollapseOwnProps &
  PolymorphicExtras<CollapseOwnProps, T>;

const statusClass: Record<Exclude<TransitionStatus, 'unmounted'>, string> = {
  entering: 'collapsing',
  entered: 'collapse show',
  exiting: 'collapsing',
  exited: 'collapse',
};

function Collapse<T extends ElementType = 'div'>({
  tag,
  horizontal = false,
  isOpen = false,
  className,
  navbar,
  cssModule,
  children,
  innerRef,
  ref: refProp,
  appear = false,
  enter = true,
  exit = true,
  timeout = TransitionTimeouts.Collapse,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  style,
  ...otherProps
}: CollapseProps<T>) {
  const Tag: ElementType = tag ?? 'div';
  const [dimension, setDimension] = useState<number | null>(null);
  const [nodeRef, ref] = useNodeRef(
    innerRef ?? (refProp as Ref<HTMLElement> | undefined),
  );
  const size = (node: HTMLElement) =>
    horizontal ? node.scrollWidth : node.scrollHeight;

  const transitionProps = pick(
    otherProps as TransitionProps,
    TransitionPropTypeKeys,
  );
  const childProps = omit(otherProps, TransitionPropTypeKeys);

  return (
    <Transition
      {...transitionProps}
      appear={appear}
      enter={enter}
      exit={exit}
      timeout={timeout}
      in={isOpen}
      nodeRef={nodeRef}
      onEntering={(node, isAppearing) => {
        setDimension(size(node));
        onEntering?.(node, isAppearing);
      }}
      onEntered={(node, isAppearing) => {
        setDimension(null);
        onEntered?.(node, isAppearing);
      }}
      onExit={(node) => {
        setDimension(size(node));
        onExit?.(node);
      }}
      onExiting={(node) => {
        void size(node); // force reflow
        setDimension(0);
        onExiting?.(node);
      }}
      onExited={(node) => {
        setDimension(null);
        onExited?.(node);
      }}
    >
      {(status) => (
        <Tag
          {...childProps}
          style={
            dimension === null
              ? style
              : { ...style, [horizontal ? 'width' : 'height']: dimension }
          }
          className={mapToCssModules(
            classNames(
              className,
              horizontal && 'collapse-horizontal',
              statusClass[status],
              navbar && 'navbar-collapse',
            ),
            cssModule,
          )}
          ref={ref}
        >
          {children}
        </Tag>
      )}
    </Transition>
  );
}

export default Collapse;
