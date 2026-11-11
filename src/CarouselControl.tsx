import type { AnchorHTMLAttributes, Ref } from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

export interface CarouselControlProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Set the direction of control button */
  direction: 'prev' | 'next';
  /** Function to be triggered on click */
  onClickHandler: () => void;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Screen reader text */
  directionText?: string;
  /** Add custom class */
  className?: string;
  ref?: Ref<HTMLAnchorElement>;
}

function CarouselControl({
  direction,
  onClickHandler,
  cssModule,
  directionText,
  className,
  ...attributes
}: CarouselControlProps) {
  const anchorClasses = mapToCssModules(
    classNames(className, `carousel-control-${direction}`),
    cssModule,
  );
  const iconClasses = mapToCssModules(
    `carousel-control-${direction}-icon`,
    cssModule,
  );
  const screenReaderClasses = mapToCssModules('visually-hidden', cssModule);

  // Bootstrap's markup uses `<a role="button">`; keyboard nav is handled by Carousel's arrow keys.
  /* oxlint-disable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/prefer-tag-over-role */
  return (
    <a
      {...attributes}
      className={anchorClasses}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        onClickHandler();
      }}
    >
      <span className={iconClasses} aria-hidden="true" />
      <span className={screenReaderClasses}>{directionText || direction}</span>
    </a>
  );
  /* oxlint-enable jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/prefer-tag-over-role */
}

export default CarouselControl;
