import {
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import classNames from 'classnames';
import { Transition, useNodeRef, type TransitionProps } from './Transition';
import { CarouselContext } from './CarouselContext';
import {
  mapToCssModules,
  pick,
  TransitionPropTypeKeys,
  TransitionTimeouts,
  type CSSModule,
  type Tag,
} from './utils';

export interface CarouselItemProps
  extends
    TransitionProps,
    Omit<HTMLAttributes<HTMLElement>, keyof TransitionProps> {
  /** Set a custom element for this component (other HTML attributes are not forwarded) */
  tag?: Tag;
  /** Whether this slide is the active one (set by `Carousel`) */
  in?: boolean;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  children?: ReactNode;
  /** Enable/disable animation */
  slide?: boolean;
  /** Add custom class */
  className?: string;
  ref?: Ref<HTMLElement>;
}

function CarouselItem({
  in: isIn,
  children,
  cssModule,
  slide = true,
  tag: Tag = 'div',
  className,
  timeout = TransitionTimeouts.Carousel,
  onEnter,
  onEntering,
  onExit,
  onExiting,
  onExited,
  ref,
  ...otherProps
}: CarouselItemProps) {
  const { direction } = useContext(CarouselContext);
  const [startAnimation, setStartAnimation] = useState(false);
  const [nodeRef, tagRef] = useNodeRef(ref);

  return (
    <Transition
      {...pick(otherProps as TransitionProps, TransitionPropTypeKeys)}
      timeout={timeout}
      enter={slide}
      exit={slide}
      in={isIn}
      nodeRef={nodeRef}
      onEnter={(node, isAppearing) => {
        setStartAnimation(false);
        onEnter?.(node, isAppearing);
      }}
      onEntering={(node, isAppearing) => {
        void node.offsetHeight; // force reflow
        setStartAnimation(true);
        onEntering?.(node, isAppearing);
      }}
      onExit={(node) => {
        setStartAnimation(false);
        onExit?.(node);
      }}
      onExiting={(node) => {
        setStartAnimation(true);
        node.dispatchEvent(new CustomEvent('slide.bs.carousel'));
        onExiting?.(node);
      }}
      onExited={(node) => {
        node.dispatchEvent(new CustomEvent('slid.bs.carousel'));
        onExited?.(node);
      }}
    >
      {(status) => {
        const isActive = status === 'entered' || status === 'exiting';
        const directionClassName =
          (status === 'entering' || status === 'exiting') &&
          startAnimation &&
          (direction === 'end' ? 'carousel-item-start' : 'carousel-item-end');
        const orderClassName =
          status === 'entering' &&
          (direction === 'end' ? 'carousel-item-next' : 'carousel-item-prev');
        const itemClasses = mapToCssModules(
          classNames(
            className,
            'carousel-item',
            isActive && 'active',
            directionClassName,
            orderClassName,
          ),
          cssModule,
        );

        return (
          <Tag className={itemClasses} ref={tagRef}>
            {children}
          </Tag>
        );
      }}
    </Transition>
  );
}

export default CarouselItem;
