import type { HTMLAttributes, Key, Ref } from 'react';
import classNames from 'classnames';
import { mapToCssModules, type CSSModule } from './utils';

/** Indicator data; extra fields are allowed (they feed the fallback key). */
export interface CarouselIndicatorItem extends Record<string, unknown> {
  /** Used as the indicator's `aria-label` */
  caption?: string;
  /** React key; falls back to the item's joined values */
  key?: Key;
}

export interface CarouselIndicatorsProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of items to show */
  items: CarouselIndicatorItem[];
  /** The current active index */
  activeIndex: number;
  /** Change underlying component's CSS base class name */
  cssModule?: CSSModule;
  /** Function to be triggered on click */
  onClickHandler: (idx: number) => void;
  /** Add custom class */
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

function CarouselIndicators({
  items,
  activeIndex,
  cssModule,
  onClickHandler,
  className,
  ...attributes
}: CarouselIndicatorsProps) {
  const listClasses = mapToCssModules(
    classNames(className, 'carousel-indicators'),
    cssModule,
  );

  return (
    <div className={listClasses} {...attributes}>
      {items.map((item, idx) => (
        <button
          aria-label={item.caption}
          data-bs-target
          type="button"
          key={`${item.key || Object.values(item).join('')}`}
          onClick={(e) => {
            e.preventDefault();
            onClickHandler(idx);
          }}
          className={mapToCssModules(
            classNames({ active: activeIndex === idx }),
            cssModule,
          )}
        />
      ))}
    </div>
  );
}

export default CarouselIndicators;
