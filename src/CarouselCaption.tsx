import type { HTMLAttributes, ReactNode, Ref } from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

export interface CarouselCaptionProps extends HTMLAttributes<HTMLElement> {
  /** Heading for the caption */
  captionHeader?: ReactNode;
  /** Text for caption */
  captionText: ReactNode;
  /** Add custom class */
  className?: string;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  ref?: Ref<HTMLDivElement>;
}

function CarouselCaption({
  captionHeader,
  captionText,
  cssModule,
  className,
  ref,
}: CarouselCaptionProps) {
  const classes = mapToCssModules(
    classNames(className, 'carousel-caption', 'd-none', 'd-md-block'),
    cssModule,
  );

  return (
    <div className={classes} ref={ref}>
      <h3>{captionHeader}</h3>
      <p>{captionText}</p>
    </div>
  );
}

export default CarouselCaption;
