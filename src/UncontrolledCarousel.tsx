import { useRef, useState, type ReactNode } from 'react';
import Carousel, { type CarouselProps } from './Carousel';
import CarouselItem from './CarouselItem';
import CarouselControl from './CarouselControl';
import CarouselIndicators, {
  type CarouselIndicatorItem,
} from './CarouselIndicators';
import CarouselCaption from './CarouselCaption';

export interface UncontrolledCarouselItem extends CarouselIndicatorItem {
  /** Image source */
  src: string;
  /** Image alt text */
  altText?: string;
  /** Caption heading; defaults to `caption` */
  header?: ReactNode;
}

export interface UncontrolledCarouselProps extends Omit<
  CarouselProps,
  'next' | 'previous' | 'children'
> {
  /** Slides to render */
  items: UncontrolledCarouselItem[];
  /** Show the indicators */
  indicators?: boolean;
  /** Show the previous/next controls */
  controls?: boolean;
  /** Start cycling on load (`ride="carousel"`) */
  autoPlay?: boolean;
  /** Initially active slide */
  defaultActiveIndex?: number;
  /** Override the built-in "next" handler */
  next?: () => void;
  /** Override the built-in "previous" handler */
  previous?: () => void;
  /** Override the built-in indicator click handler */
  goToIndex?: (idx: number) => void;
}

function UncontrolledCarousel({
  defaultActiveIndex,
  autoPlay = true,
  indicators = true,
  controls = true,
  items,
  goToIndex,
  ...props
}: UncontrolledCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || 0);
  const animating = useRef(false);

  const next = () => {
    if (animating.current) return;
    setActiveIndex((i) => (i === items.length - 1 ? 0 : i + 1));
  };
  const previous = () => {
    if (animating.current) return;
    setActiveIndex((i) => (i === 0 ? items.length - 1 : i - 1));
  };
  const goTo = (idx: number) => {
    if (animating.current) return;
    setActiveIndex(idx);
  };

  const slides = items.map((item) => (
    <CarouselItem
      onExiting={() => void (animating.current = true)}
      onExited={() => void (animating.current = false)}
      key={item.key || item.src}
    >
      <img className="d-block w-100" src={item.src} alt={item.altText} />
      <CarouselCaption
        captionText={item.caption}
        captionHeader={item.header || item.caption}
      />
    </CarouselItem>
  ));

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      ride={autoPlay ? 'carousel' : undefined}
      {...props}
    >
      {indicators && (
        <CarouselIndicators
          items={items}
          activeIndex={props.activeIndex || activeIndex}
          onClickHandler={goToIndex || goTo}
        />
      )}
      {slides}
      {controls && (
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={props.previous || previous}
        />
      )}
      {controls && (
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={props.next || next}
        />
      )}
    </Carousel>
  );
}

export default UncontrolledCarousel;
